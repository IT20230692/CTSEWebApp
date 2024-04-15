import AWS from 'aws-sdk';
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

AWS.config.update({
    accessKeyId: 'YOUR_ACCESS_KEY_ID',
    secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
    region: 'YOUR_REGION'
});
const secretsManager = new AWS.SecretsManager();

const getSecret = async () => {
    try {
        const data = await secretsManager.getSecretValue({ SecretId: 'SecretId' }).promise();
        const secret = JSON.parse(data.SecretString);
        return secret;
    } catch (err) {
        console.error("Error retrieving secret:", err);
        throw err; // Rethrow the error to handle it in the calling code
    }
};

export default getSecret;

