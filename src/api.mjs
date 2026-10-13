import {authorize,validateText} from './security.mjs';
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
export function createApi({authenticate,db}){
 if(typeof authenticate!=='function'||!db)throw new Error('API dependencies required');
 return async function handle(request){
  const url=new URL(request.url);
  if(url.pathname==='/api/health'&&request.method==='GET')return json({status:'staging',live:false});
  if(!url.pathname.startsWith('/api/'))return json({error:'Not found'},404);
  let identity;try{identity=await authenticate(request)}catch{return json({error:'Unauthorised'},401)}
  if(!identity?.userId)return json({error:'Unauthorised'},401);
  const match=url.pathname.match(/^\/api\/organisations\/([^/]+)\/customers(?:\/([^/]+))?$/);
  if(!match)return json({error:'Not found'},404);
  const [,orgId,customerId]=match;
  const membership=await db.prepare('SELECT role FROM memberships WHERE user_id=? AND organisation_id=?').bind(identity.userId,orgId).first();
  if(!authorize([{user_id:identity.userId,organisation_id:orgId,role:membership?.role}],identity.userId,orgId))return json({error:'Not found'},404);
  if(request.method==='GET'&&!customerId){
   const rows=await db.prepare('SELECT id,name,email,phone,address,created_at FROM customers WHERE organisation_id=? AND archived_at IS NULL ORDER BY created_at DESC LIMIT 100').bind(orgId).all();
   return json({customers:rows.results||[]});
  }
  if(request.method==='GET'&&customerId){
   const row=await db.prepare('SELECT id,name,email,phone,address,created_at FROM customers WHERE id=? AND organisation_id=? AND archived_at IS NULL').bind(customerId,orgId).first();
   return row?json({customer:row}):json({error:'Not found'},404);
  }
  if(request.method==='POST'&&!customerId){
   if(request.headers.get('content-type')?.split(';')[0].trim().toLowerCase()!=='application/json')return json({error:'JSON required'},415);
   const declaredLength=Number(request.headers.get('content-length'));
   if(Number.isFinite(declaredLength)&&declaredLength>8192)return json({error:'Request too large'},413);
   if(!authorize([{user_id:identity.userId,organisation_id:orgId,role:membership.role}],identity.userId,orgId,['owner','admin']))return json({error:'Forbidden'},403);
   let input;
   try {
    const raw=await request.text();
    if(new TextEncoder().encode(raw).length>8192)return json({error:'Request too large'},413);
    input=JSON.parse(raw);
    if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('Invalid JSON object');
    input={name:validateText(input.name,160),
     email:input.email==null||input.email===''?null:validateText(input.email,254),
     phone:input.phone==null||input.phone===''?null:validateText(input.phone,50),
     address:input.address==null||input.address===''?null:validateText(input.address,500)};
    if(input.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email))throw new Error('Invalid email');
   } catch {return json({error:'Invalid request'},400)}
   const id=crypto.randomUUID();
   await db.prepare('INSERT INTO customers (id,organisation_id,name,email,phone,address) VALUES (?,?,?,?,?,?)').bind(id,orgId,input.name,input.email,input.phone,input.address).run();
   return json({id},201);
  }
  if(request.method==='DELETE'&&customerId){
   if(!['owner','admin'].includes(membership.role))return json({error:'Forbidden'},403);
   const result=await db.prepare('UPDATE customers SET archived_at=CURRENT_TIMESTAMP WHERE id=? AND organisation_id=? AND archived_at IS NULL').bind(customerId,orgId).run();
   return result.meta?.changes?json({archived:true}):json({error:'Not found'},404);
  }
  return json({error:'Method not allowed'},405);
 }
}
