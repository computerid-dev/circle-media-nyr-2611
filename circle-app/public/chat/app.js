import{boot,S,$,el,load,urls,upload,tag,av,canManage,go,setTitle,db,collection,addDoc,deleteDoc,onSnapshot,query,orderBy,limit}from'/shared.js';
const c=await boot({needCommunity:true});
c.innerHTML='<div id="msgs"></div><form class="send" id="send"><button type="button" class="w" id="attach">File</button><input id="file" type="file" accept="image/*,video/*" hidden><input id="text" placeholder="Tulis pesan" autocomplete="off"><button id="sendBtn">Kirim</button></form>';
let watching=null,stop=null,last=[];
const render=()=>{const b=$('#msgs');b.replaceChildren(...last.map(msgEl));b.scrollTop=b.scrollHeight};
function msgEl(d){const m=d.data(),u=S.users.get(m.uid)||{name:m.name},mem=S.mems.get(m.uid),row=el('div','msg'),body=el('div'),h=el('div');
h.append(el('b','',u.name||m.name));if(mem)h.append(tag(mem.roleName,mem.color));h.append(el('small','',new Date(m.createdAt).toLocaleString('id-ID',{dateStyle:'short',timeStyle:'short'})));
if(m.uid===S.me.uid||canManage()){const x=el('button','w mini','hapus');x.onclick=()=>deleteDoc(d.ref);h.append(x)}
body.append(h);if(m.text)body.append(el('p','',m.text));
if(m.fileKey&&urls.get(m.fileKey)){const v=(m.fileType||'').startsWith('video'),e=el(v?'video':'img');e.src=urls.get(m.fileKey);if(v)e.controls=true;else e.alt='Lampiran';body.append(e)}
row.append(av(u),body);return row}
S.onChange=()=>{
if(!S.cid){setTitle('Chat');$('#send').hidden=true;return}
if(!S.chid){const t=S.chans.find(x=>(x.type||'text')==='text');if(t){S.chid=t.id;history.replaceState(null,'',`?c=${S.cid}&ch=${t.id}`)}}
const ch=S.chans.find(x=>x.id===S.chid);if(!ch){setTitle(S.comms.find(x=>x.id===S.cid)?.name||'Chat');$('#send').hidden=true;return}
if(ch.type==='voice')return go('/voice/',{c:S.cid,ch:ch.id});
setTitle('# '+ch.name);$('#send').hidden=false;
if(watching!==ch.id){watching=ch.id;stop?.();
stop=onSnapshot(query(collection(db,`communities/${S.cid}/channels/${ch.id}/messages`),orderBy('createdAt'),limit(100)),async s=>{await load(s.docs.map(d=>d.data().fileKey));last=s.docs;render()})}else render()};
S.onChange();
$('#send').onsubmit=async e=>{e.preventDefault();const text=$('#text').value.trim(),f=$('#file').files[0];if(!text&&!f)return;$('#sendBtn').disabled=true;
try{const m={uid:S.me.uid,name:S.me.name,text,createdAt:Date.now()};if(f){$('#sendBtn').textContent='Upload...';m.fileKey=await upload(f);m.fileType=f.type}
await addDoc(collection(db,`communities/${S.cid}/channels/${S.chid}/messages`),m);$('#text').value='';$('#file').value='';$('#attach').textContent='File'}catch(x){alert(x.message)}
$('#sendBtn').disabled=false;$('#sendBtn').textContent='Kirim'};
$('#attach').onclick=()=>$('#file').click();$('#file').onchange=()=>{$('#attach').textContent=$('#file').files[0]?'Dipilih':'File'};
