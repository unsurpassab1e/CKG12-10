import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  "type": "service_account",
  "project_id": "ckg-tournaments",
  "private_key_id": "your-private-key-id",
  "private_key": process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  "client_email": process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_ADMIN_CLIENT_ID,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": process.env.FIREBASE_ADMIN_CERT_URL,
  "universe_domain": "googleapis.com"
};

const app = initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
  databaseURL: "https://ckg-tournaments-default-rtdb.firebaseio.com"
});

export const adminDb = getFirestore(app);

export default app;