import{boot,S,el,fld,av,upload,setTitle,db,doc,updateDoc}from'/shared.js';
const c=await boot();c.classList.add('pad');setTitle('Profil');
let drawn=false;
S.onChange=()=>{if(drawn)return;drawn=true;
const f=el('form','card'),[l1,n]=fld('Nama tampilan',S.me.name),[l2,b]=fld('Bio',S.me.bio||''),[l3,fi]=fld('Foto profil','','file'),msg=el('p','err');
fi.accept='image/*';n.maxLength=40;b.maxLength=120;f.append(av(S.me,80),el('b','',`@${S.me.username} - ${S.me.role}`),l1,l2,l3,msg,el('button','','Simpan'));
f.onsubmit=async e=>{e.preventDefault();msg.className='err';msg.textContent='';try{const d={name:n.value.trim().slice(0,40),bio:b.value.slice(0,120)};if(!d.name)throw Error('Nama wajib diisi');const x=fi.files[0];if(x){if(!x.type.startsWith('image/'))throw Error('Foto harus berupa gambar');d.avatarKey=await upload(x)}await updateDoc(doc(db,'users',S.me.uid),d);msg.className='ok';msg.textContent='Profil tersimpan'}catch(x){msg.textContent=x.message}};
c.append(f)};
S.onChange();
