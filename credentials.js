import { google } from 'googleapis';

const iamcred = google.iamcredentials('v1');

const PROJECT_DEFAULT_SERVICE_ACCOUNT = 'YOUR_SERVICE_ACCOUNT';

export async function fetchIdentityToken(functionUrl) {
  try {
    const data = {
      serviceAccountEmail: PROJECT_DEFAULT_SERVICE_ACCOUNT,
      audience: functionUrl
    };
    const tokenResponse = await getIdToken(data);
    return tokenResponse;
  } catch (error) {
    console.error(error);
    throw new Error(`Error fetching identity token ${error}`);
  }
}

async function getIdToken(data)  {
  try {
    const { serviceAccountEmail, audience } = data;
    const token = await getServiceAccountIdToken(serviceAccountEmail, audience);
    return token;
  } catch (error) {
    console.error(error);
    throw new Error(`Error getting id token ${error}`);
  }
};

async function getServiceAccountIdToken(serviceAccountEmail, audience) {
  try {
    const authClient = await getAuthorizedClient();
    const request = {
      name: `projects/-/serviceAccounts/${serviceAccountEmail}`,
      auth: authClient,
      audience,
      includeEmail: true,
      delegates: [`projects/-/serviceAccounts/${serviceAccountEmail}`]
    };
    const response = (await iamcred.projects.serviceAccounts.generateIdToken(request)).data;
    return response.token;
  } catch (error) {
    console.error(error);
    throw new Error(`Error getting service account auth token ${error}`);
  }
};

async function getAuthorizedClient() {
  try {
    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    return await auth.getClient();
  } catch (error) {
    console.error(error);
    throw new Error(`Error getting authorized client ${error}`); 
  }
};
