import { Storage } from '@google-cloud/storage';
import axios from 'axios';
import { fetchIdentityToken } from './credentials.js';

const PROJECT_ID = 'YOUR_PROJECT_ID'; 
const BUCKET_NAME = 'YOUR_BUCKET_NAME'; 

const storage = new Storage({ projectId: PROJECT_ID });
const bucket = storage.bucket(BUCKET_NAME);

// Store signedUrl in GCP for this time
const URL_DURATION = 30 * 1000 // Thirty seconds
const FUNCTION_URL = 'YOUR_FUNCTION_URL'; // You will get this from the function deployment response

const MY_ENV = 'development'; // in prod would use process.env.NODE_ENV

export async function getStorageSignedUrl(filePath, mimeType) {
  try {
    return MY_ENV === 'development'
      ? getLocalDevSignedUrl(filePath, mimeType)
      : bucket.file(filePath).getSignedUrl({
          version: 'v4',
          action: 'write',
          expires: Date.now() + URL_DURATION,
          contentType: mimeType || 'application/octet-stream'
        });
  } catch (error) {
    console.error(error);
    throw new Error(`Error getting signed url ${error}`);
  }
};

async function getLocalDevSignedUrl(filePath, mimeType) {
  try {
    const functionUrl = `${FUNCTION_URL}`;
    const token = await fetchIdentityToken(functionUrl);

    const response = await axios({
      url: functionUrl,
      method: 'POST',
      headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json' },
      data: { filePath, mimeType, expires: Date.now() + URL_DURATION }
    });

    if (!response?.data) {
      throw new Error();
    }

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Error getting signed url for local development ${error}`);
  }
};


  