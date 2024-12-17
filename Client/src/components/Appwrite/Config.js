//src/appwriteConfig.js
import { Client, Account,ID } from 'appwrite';

export const API_ENDPOINT = import.meta.env.VITE_APPWRITE_URL
export const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID

const client = new Client()
    .setEndpoint(API_ENDPOINT) 
    .setProject(PROJECT_ID);    

 const account = new Account(client);

export { account,client,ID }; 
