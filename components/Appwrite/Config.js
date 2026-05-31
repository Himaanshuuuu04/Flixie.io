//src/appwriteConfig.js
import { Client, Account, ID, Databases, Query } from "appwrite";
export const API_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_URL;
export const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

const client = new Client().setEndpoint(API_ENDPOINT).setProject(PROJECT_ID);
const account = new Account(client);
const databases = new Databases(client);
export { account, client, databases, ID, Query };
