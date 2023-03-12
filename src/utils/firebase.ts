import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyB9CJtCzBqGsC0cJFebPK2S-cgzllhdZYQ',
  authDomain: 'human-wallet-9863e.firebaseapp.com',
  projectId: 'human-wallet-9863e',
  storageBucket: 'human-wallet-9863e.appspot.com',
  messagingSenderId: '290641545437',
  appId: '1:290641545437:web:2edba62e13ff47402a7334',
  measurementId: 'G-6DL8VMY3XY',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
