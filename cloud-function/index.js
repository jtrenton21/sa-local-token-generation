import { Storage } from '@google-cloud/storage';

const BUCKET_NAME = 'YOUR_BUCKET_NAME';
const PROJECT_ID = 'YOUR_PROJECT_ID';

const storage = new Storage({ projectId: PROJECT_ID });
const bucket = storage.bucket(BUCKET_NAME);

export const getSignedUrl = async (req, res) => {
  const {
    filePath,
    mimeType,
    action = 'write',
    expires = Date.now() + 30 * 1000 // Thirty seconds
  } = req.body;

  if (!filePath) {
    res.status(400).send({ error: 'Missing filePath parameter' });
    return;
  }

  try {
    const [signedUrl] = await bucket.file(filePath).getSignedUrl({
      version: 'v4',
      action,
      expires,
      contentType: mimeType || 'application/octet-stream'
    });
    res.send({ signedUrl });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).send({ error: error.message });
  }
};