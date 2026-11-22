import { S3Client } from '@aws-sdk/client-s3';

let cachedClient;

export function getClient() {
  if (!cachedClient) {
    cachedClient = new S3Client({
      region: process.env.B2_REGION,
      endpoint: process.env.B2_ENDPOINT,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.B2_KEY_ID,
        secretAccessKey: process.env.B2_APPLICATION_KEY,
      },
      // B2 belum cocok dengan checksum otomatis SDK versi baru
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    });
  }
  return cachedClient;
}

export function getBucket() {
  return process.env.B2_BUCKET;
}
