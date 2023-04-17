import { getStorageSignedUrl } from './cloud-storage.js';

async function main() {
    const filePath = './test.png';
    const mimeType = 'image/png';
    const signedUrl = await getStorageSignedUrl(filePath, mimeType);
    console.log('Signed URL', signedUrl);
}

main();