import{boot,S,$,el,ask,tag,av,canManage,setTitle,db,collection,doc,setDoc,addDoc,deleteDoc}from'/shared.js';
const c=await boot({needCommunity:true});
c.classList.add('pad');setTitle('Anggota dan role');
async function assign(uid,rid){const r=S.roles.find(x=>x.id===rid),ref=doc(db,`communities/${S.cid}/members/${uid}`);try{if(!r)await deleteDoc(ref);else await setDoc(ref,{roleId:r.id,roleName:r.name,color:r.color,mod:!!r.mod})}catch(e){alert(e.message)}}
async function delRole(r){if(!confirm(`Hapus role ${r.name}?`))return;for(const[u,m]of S.mems)if(m.roleId===r.id)await deleteDoc(doc(db,`communities/${S.cid}/members/${u}`));await deleteDoc(doc(db,`communities/${S.cid}/roles/${r.id}`))}
S.onChange=()=>{c.replaceChildren();if(!S.cid){c.append(el('p','','Pilih komunitas dulu'));return}
const w=el('div','stack'),cl=el('div','chips');w.append(el('h3','','Role'));
S.roles.forEach(r=>{const t=tag(r.name+(r.mod?' (mod)':''),r.color);if(canManage()){const x=el('button','r mini','x');x.onclick=()=>delRole(r);t.append(x)}cl.append(t)});w.append(cl);
if(canManage()){const b=el('button','','+ Role');b.onclick=async()=>{const v=await ask('Role baru',[['name','Nama role'],['color','Warna','color','#4D96FF'],['mod','Boleh moderasi (hapus pesan, kelola channel)','checkbox']]);if(v?.name.trim())await addDoc(collection(db,`communities/${S.cid}/roles`),{name:v.name.trim().slice(0,24),color:v.color,mod:!!v.mod})};w.append(b)}
w.append(el('h3','','Anggota'));
[...S.users].forEach(([uid,u])=>{const row=el('div','urow'),i=el('div','grow'),m=S.mems.get(uid);i.append(el('b','',u.name));if(m)i.append(tag(m.roleName,m.color));i.append(el('small','',` @${u.username} - ${u.role}`));row.append(av(u),i);
if(canManage()&&S.roles.length){const s=el('select'),o0=el('option','','Tanpa role');o0.value='';s.append(o0);S.roles.forEach(r=>{const o=el('option','',r.name);o.value=r.id;s.append(o)});s.value=m?.roleId||'';s.onchange=()=>assign(uid,s.value);row.append(s)}w.append(row)});c.append(w)};
S.onChange();
