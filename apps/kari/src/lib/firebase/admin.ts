import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  initializeApp,
  cert,
  getApps,
  type ServiceAccount,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const { env } = getCloudflareContext();

const serviceAccount: ServiceAccount = {
  projectId: env.FIREBASE_ADMIN_PROJECT_ID,
  privateKey: (env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL,
};

export const admin =
  getApps()[0] ||
  initializeApp({
    credential: cert(serviceAccount),
  });

export const adminAuth = getAuth();
