import{auth,cfgError,signInWithEmailAndPassword,onAuthStateChanged,$,el}from'/shared.js';
document.body.innerHTML='<main class="center"><form id="f" class="card"><h2 style="margin:0">Masuk ke Circle</h2><p style="margin:0">Akun dibuat oleh owner. Tidak ada pendaftaran sendiri.</p><label>Username<input id="u" autocomplete="username" required></label><label>Password<input id="p" type="password" autocomplete="current-password" required></label><p id="err" class="err"></p><button>Masuk</button></form></main>';
if(!auth)$('#err').textContent='Backend belum siap: '+cfgError;
else onAuthStateChanged(auth,u=>{if(u)location.replace('/chat/')});
$('#f').onsubmit=async e=>{e.preventDefault();$('#err').textContent='';if(!auth)return;try{await signInWithEmailAndPassword(auth,`${$('#u').value.trim().toLowerCase()}@circle.local`,$('#p').value)}catch{$('#err').textContent='Username atau password salah'}};
