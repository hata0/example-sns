import { FirebaseOptions, getApps, initializeApp } from "firebase/app";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const firebaseConfig = async () => {
  const { env } = await getCloudflareContext({ async: true });

  return {
    apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  } satisfies FirebaseOptions;
};

export const getApp = async () =>
  getApps()?.length ? getApps()[0] : initializeApp(await firebaseConfig());
