(() => {
  // Link pin resmi (localhost hanya sementara, hapus saat SIAP DEPLOY)
  const PIN_HOSTS = ['circle-media-nyr-2611.vercel.app', 'localhost', '127.0.0.1'];
  const DESTINATION = 'https://circle-media-nyr-app.vercel.app/';

  if (PIN_HOSTS.includes(location.hostname)) {
    location.replace(DESTINATION);
    return;
  }
  document.body.textContent = 'link tidak resmi! Tidak dapat dibuka!';
})();
