import {
  initializeApp,
  cert,
  getApps,
  type ServiceAccount,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(
    /\\n/g,
    "\n",
  ),
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
};

export const firebaseAdmin =
  getApps()[0] ||
  initializeApp({
    credential: cert(serviceAccount),
  });

export const firebaseAuth = getAuth();
