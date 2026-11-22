import{boot,S,el,fld,tag,api,setTitle}from'/shared.js';
const c=await boot();c.classList.add('pad');setTitle('Kelola akun');
if(S.me.role!=='owner'){c.append(el('p','','Hanya owner yang boleh membuat akun'))}
else{const w=el('div','stack'),f=el('form','card'),[l1,u]=fld('Username (huruf kecil, angka, _)'),[l2,pw]=fld('Password'),[l3,nm]=fld('Nama tampilan'),l4=el('label','','Role'),rs=el('select'),msg=el('p','err'),gen=el('button','w','Acak password'),out=el('div','stack');
u.pattern='[a-z0-9_]{3,20}';u.required=pw.required=true;pw.minLength=6;gen.type='button';
[['member','Member'],['admin','Admin']].forEach(([a,t])=>{const o=el('option','',t);o.value=a;rs.append(o)});l4.append(rs);
gen.onclick=()=>{const k='abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';pw.value=Array.from(crypto.getRandomValues(new Uint8Array(10)),x=>k[x%k.length]).join('')};
f.append(el('h3','','Buat akun member'),l1,l2,gen,l3,l4,msg,el('button','','Buat akun'));
f.onsubmit=async e=>{e.preventDefault();msg.className='err';msg.textContent='';try{const d=await api('/api/create-member',{username:u.value.trim(),password:pw.value,name:nm.value.trim(),role:rs.value});
const r=el('div','urow'),i=el('div','grow',`${d.username} / ${pw.value}`),b=el('button','w','Salin');b.onclick=async()=>{await navigator.clipboard.writeText(`Username: ${d.username}\nPassword: ${pw.value}`);b.textContent='Tersalin'};r.append(i,tag(d.role),b);out.prepend(r);msg.className='ok';msg.textContent='Akun dibuat, salin password sekarang';f.reset()}catch(x){msg.textContent=x.message}};
w.append(f,out);c.append(w)}
