# Service Account Local Auth Token Generation with ADC 
This is the repo for the Medium article 
[Generating Local Auth Tokens for Service Accounts with Node.js & GCP](https://medium.com/@trentonliebman/generating-local-auth-tokens-for-service-accounts-with-node-js-gcp-3e61811fc6e0)

## Installation

In the root and cloud-function folder run the following
```bash
npm install
```
Make sure to update all variables with your values.

Everything you need to get this project setup to test is in the article.
## Usage
After installing both projects and updating the variables you will run the following in the cloud-function directory
```bash
  npm run deploy
```
Then change back to the root directory and run 
```bash
  npm run start
```
If you followed the directions you should see a signedUrl in the console log response.