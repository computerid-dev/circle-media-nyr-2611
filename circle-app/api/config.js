const REQUIRED = [
  'FIREBASE_WEB_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_APP_ID',
];

export default function handler(req, res) {
  const missing = REQUIRED.filter((key) => !process.env[key]);
  if (missing.length) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(500).json({ error: `Environment Variable belum diisi: ${missing.join(', ')}` });
  }

  res.setHeader('Cache-Control', 'public, max-age=300');
  res.status(200).json({
    apiKey: process.env.FIREBASE_WEB_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    appId: process.env.FIREBASE_APP_ID,
  });
}
