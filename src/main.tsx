import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import emailjs from '@emailjs/browser';
import App from './App';
import './index.css';

// Initialize EmailJS with your public key
const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;

if (emailjsPublicKey && emailjsServiceId) {
  emailjs.init(emailjsPublicKey);
} else {
  console.warn('EmailJS configuration missing. Email features will be disabled.');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);