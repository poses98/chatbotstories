import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCpitxa6of07zmFhubpG6AH1o9BcGWI4GQ',
  authDomain: 'chatbotstories.firebaseapp.com',
  projectId: 'chatbotstories',
  storageBucket: 'chatbotstories.appspot.com',
  messagingSenderId: '355055867626',
  appId: '1:355055867626:web:b192912fd935da751be993',
  measurementId: 'G-H9MZ3606L3',
};

export const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
