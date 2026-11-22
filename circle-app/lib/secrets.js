// Semua nilai ditanam di backend (permintaan customer), tanpa environment variable.
// File ini hanya dibaca oleh folder api/ dan lib/. Vercel hanya menyajikan folder public/,
// jadi file ini tidak bisa dibuka dari browser. Repo WAJIB privat.
// Bagian bertanda ISI_SENDIRI harus diisi sebelum deploy.
export const SECRETS = {
  B2_KEY_ID: 'ISI_SENDIRI',            // keyID Application Key "circle-app" (bukan master key)
  B2_APPLICATION_KEY: 'ISI_SENDIRI',   // applicationKey Application Key "circle-app"
  B2_BUCKET: 'circle-media-nyr-2611',
  B2_ENDPOINT: 'https://s3.us-east-005.backblazeb2.com',
  B2_REGION: 'us-east-005',

  FIREBASE_PROJECT_ID: 'circle-media-nyr-2611',
  FIREBASE_WEB_API_KEY: 'AIzaSyB8cVldP6E9aohyM51g2RYIRx4NwlMs8OA',
  FIREBASE_AUTH_DOMAIN: 'circle-media-nyr-2611.firebaseapp.com',
  FIREBASE_APP_ID: '1:314167177695:web:fc214aea32c7505288946a',
  FIREBASE_CLIENT_EMAIL: 'ISI_SENDIRI', // client_email dari JSON service account
  FIREBASE_PRIVATE_KEY: 'ISI_SENDIRI',  // private_key dari JSON service account (boleh dengan \n apa adanya)

  // Dipakai sekali untuk membuat owner pertama lewat akun.html. Setelah owner jadi, ganti ke ''.
  OWNER_SETUP_SECRET: 'ISI_SENDIRI',

  // Opsional: TURN server untuk voice room di jaringan seluler yang ketat. Kosongkan kalau tidak dipakai.
  TURN_URL: '',
  TURN_USERNAME: '',
  TURN_CREDENTIAL: '',
};
