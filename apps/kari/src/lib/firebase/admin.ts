import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  initializeApp,
  cert,
  getApps,
  type ServiceAccount,
} from "firebase-admin/app";

const getServiceAccount = async (): Promise<ServiceAccount> => {
  const { env } = getCloudflareContext();
  return {
    projectId: env.FIREBASE_ADMIN_PROJECT_ID,
    privateKey: (env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL,
  };
};

export const getAdmin = async () =>
  getApps()[0] ||
  initializeApp({
    credential: cert(await getServiceAccount()),
  });
