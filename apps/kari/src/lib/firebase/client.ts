import { FirebaseOptions, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyBymyo1yqq_enyCTM1wK-zG0pc2M0DhrFw",
  authDomain: "example-sns-505df.firebaseapp.com",
  projectId: "example-sns-505df",
  storageBucket: "example-sns-505df.firebasestorage.app",
  messagingSenderId: "1097685622948",
  appId: "1:1097685622948:web:b411c9981f8f80a9fb8631",
  measurementId: "G-SB34C64C1C",
};

const app = getApps()?.length ? getApps()[0] : initializeApp(firebaseConfig);

export const clientAuth = getAuth(app);
