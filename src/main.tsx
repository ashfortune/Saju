import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';


console.log("VITE_KEY:", import.meta.env.VITE_GEMINI_API_KEY);
console.log("RAW_KEY:", import.meta.env.GEMINI_API_KEY);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
