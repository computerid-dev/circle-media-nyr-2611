import{initializeApp}from'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import{getAuth,signInWithEmailAndPassword,onAuthStateChanged,signOut}from'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import{getFirestore,collection,doc,getDoc,setDoc,addDoc,deleteDoc,updateDoc,onSnapshot,query,orderBy,limit,where}from'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
export{collection,doc,getDoc,setDoc,addDoc,deleteDoc,updateDoc,onSnapshot,query,orderBy,limit,where,signInWithEmailAndPassword,onAuthStateChanged,signOut};
export const $=s=>document.querySelector(s);
export const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
export let auth=null,db=null,cfgError='';
try{const r=await fetch('/api/config'),d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||'HTTP '+r.status);auth=getAuth(initializeApp(d));db=getFirestore(auth.app)}catch(e){cfgError=e.message}
export const api=async(p,b)=>{const t=await auth.currentUser.getIdToken(),r=await fetch(p,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify(b||{})}),d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||'Permintaan gagal');return d};
export const urls=new Map();
export async function load(keys){const m=[...new Set(keys.filter(k=>k&&!urls.has(k)))];for(let i=0;i<m.length;i+=30){try{const{urls:u}=await api('/api/download-url',{keys:m.slice(i,i+30)});for(const k in u)urls.set(k,u[k])}catch(e){console.error(e)}}}
export async function upload(f){const{key,uploadUrl}=await api('/api/upload-url',{contentType:f.type,size:f.size});const r=await fetch(uploadUrl,{method:'PUT',headers:{'Content-Type':f.type},body:f});if(!r.ok)throw Error('Upload gagal, cek CORS bucket');return key}
const lum=c=>{const n=parseInt(c.slice(1),16);return((n>>16)*299+((n>>8)&255)*587+(n&255)*114)/1000};
export const tag=(t,c='#FFD93D')=>{const s=el('span','tag',t);s.style.background=c;s.style.color=lum(c)<128?'#fff':'#000';return s};
export function av(u={},px=40){const a=el('div','av',(u.name||'?')[0].toUpperCase());a.style.width=a.style.height=px+'px';if(u.avatarKey)load([u.avatarKey]).then(()=>{const s=urls.get(u.avatarKey);if(s){a.style.backgroundImage=`url("${s}")`;a.textContent=''}});return a}
export const fld=(l,v='',t='text')=>{const lb=el('label','',l),i=el('input');i.type=t;i.value=v;lb.append(i);return[lb,i]};
export function ask(title,fields){return new Promise(ok=>{let d=$('#dlg');if(!d){d=el('dialog');d.id='dlg';d.append(el('form'));document.body.append(d)}const f=d.firstChild;f.replaceChildren(el('h3','',title));
fields.forEach(([n,l,t='text',v='',o=[]])=>{const lb=el('label','',l);let i;if(t==='select'){i=el('select');o.forEach(([a,b])=>{const op=el('option','',b);op.value=a;i.append(op)})}else{i=el('input');i.type=t;if(t==='checkbox')i.style.width='auto'}
i.name=n;if(t==='checkbox')i.checked=!!v;else i.value=v;lb.append(i);f.append(lb)});
const row=el('div','row'),c=el('button','w','Batal'),s=el('button','','Simpan');c.type='button';c.onclick=()=>{d.close();ok(null)};row.append(c,s);f.append(row);
d.oncancel=()=>ok(null);f.onsubmit=e=>{e.preventDefault();ok(Object.fromEntries(new FormData(f)));d.close()};d.showModal()})}

export const S={me:null,users:new Map(),comms:[],chans:[],roles:[],mems:new Map(),cid:null,chid:null,onChange:null};
const STAFF=['owner','admin'],stops={};
export const canManage=()=>!!S.cid&&(STAFF.includes(S.me.role)||S.comms.find(c=>c.id===S.cid)?.createdBy===S.me.uid||!!S.mems.get(S.me.uid)?.mod);
export const go=(path,p={})=>{const q=new URLSearchParams(Object.entries(p).filter(([,v])=>v));location.href=path+(q.size?'?'+q:'')};
export const setTitle=t=>{$('#title').textContent=t};
const changed=()=>S.onChange&&S.onChange();

function drawRail(){const r=$('#rail');r.replaceChildren(...S.comms.map(c=>{const b=el('button',c.id===S.cid?'':'w',(c.name||'?')[0].toUpperCase());b.title=c.name;b.onclick=()=>go('/chat/',{c:c.id});return b}));
const p=el('button','w','+');p.title='Komunitas baru';p.onclick=async()=>{const v=await ask('Komunitas baru',[['name','Nama komunitas']]);if(v?.name.trim()){const r=await addDoc(collection(db,'communities'),{name:v.name.trim().slice(0,40),createdBy:S.me.uid,createdAt:Date.now()});go('/chat/',{c:r.id})}};r.append(p)}
function drawChans(){$('#cname').textContent=S.comms.find(c=>c.id===S.cid)?.name||'Circle';const box=$('#chans');box.replaceChildren();if(!S.cid)return;
[['text','Teks','#'],['voice','Suara','~']].forEach(([t,l,s])=>{box.append(el('h4','',l));S.chans.filter(c=>(c.type||'text')===t).forEach(c=>{const b=el('button','item'+(S.chid===c.id?' on':''),`${s} ${c.name}`);b.onclick=()=>go(t==='voice'?'/voice/':'/chat/',{c:S.cid,ch:c.id});box.append(b)})});
if(canManage()){const a=el('button','w','+ Channel');a.onclick=async()=>{const v=await ask('Channel baru',[['name','Nama channel'],['type','Jenis','select','text',[['text','Teks'],['voice','Suara']]]]);if(v?.name.trim())await addDoc(collection(db,`communities/${S.cid}/channels`),{name:v.name.trim().slice(0,30),type:v.type,createdAt:Date.now()})};box.append(a)}}
function watchCommunity(id){S.cid=id;
stops.chans=onSnapshot(collection(db,`communities/${id}/channels`),s=>{S.chans=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>a.name.localeCompare(b.name));drawChans();changed()});
stops.roles=onSnapshot(collection(db,`communities/${id}/roles`),s=>{S.roles=s.docs.map(d=>({id:d.id,...d.data()}));drawChans();changed()});
stops.mems=onSnapshot(collection(db,`communities/${id}/members`),s=>{S.mems=new Map(s.docs.map(d=>[d.id,d.data()]));drawChans();changed()})}

// Dipanggil tiap halaman: cek login, bangun kerangka (rail, channel, header), kembalikan area isi
export function boot(opts={}){return new Promise(resolve=>{
if(!auth){document.body.textContent='Backend belum siap: '+cfgError;return}
let started=false;
onAuthStateChanged(auth,async user=>{if(started)return;
if(!user){location.replace('/');return}started=true;
const s=await getDoc(doc(db,'users',user.uid));if(!s.exists()){await signOut(auth);location.replace('/');return}
S.me={uid:user.uid,...s.data()};const q=new URLSearchParams(location.search);S.cid=q.get('c');S.chid=q.get('ch');
document.body.innerHTML='<div id="app"><div id="nav"><nav id="rail"></nav><aside id="side"><h3 id="cname">Circle</h3><div id="chans"></div><div class="me"><div class="who" id="who"></div><div class="btns"><button class="w" id="bProf">Profil</button><button class="w" id="bAdm" hidden>Akun</button><button class="r" id="bOut">Keluar</button></div></div></aside></div><section id="main"><header><button class="w" id="menu">Menu</button><strong id="title"></strong><button class="w" id="tChat">Chat</button><button class="w" id="tMem">Anggota</button></header><div class="pane" id="content"></div></section></div>';
$('#menu').onclick=()=>$('#nav').classList.toggle('open');
$('#bProf').onclick=()=>go('/profile/',{c:S.cid});$('#bAdm').onclick=()=>go('/admin/',{c:S.cid});$('#bAdm').hidden=S.me.role!=='owner';
$('#tChat').onclick=()=>go('/chat/',{c:S.cid,ch:S.chid});$('#tMem').onclick=()=>go('/members/',{c:S.cid});
$('#bOut').onclick=async()=>{await signOut(auth);location.replace('/')};
const drawMe=()=>$('#who').replaceChildren(av(S.me),el('div','grow',S.me.name));drawMe();
const startId=S.cid;if(startId)watchCommunity(startId);
onSnapshot(collection(db,'users'),q=>{S.users=new Map(q.docs.map(d=>[d.id,d.data()]));if(S.users.has(S.me.uid))S.me={uid:S.me.uid,...S.users.get(S.me.uid)};drawMe();changed()});
onSnapshot(collection(db,'communities'),q=>{S.comms=q.docs.map(d=>({id:d.id,...d.data()}));
if(!S.cid&&opts.needCommunity&&S.comms.length){const id=S.comms[0].id;history.replaceState(null,'','?c='+id);watchCommunity(id)}
drawRail();drawChans();changed()});
resolve($('#content'))})})}
