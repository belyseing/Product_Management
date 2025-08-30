import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext.tsx';

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <AuthProvider>
          <App />
    </AuthProvider>
  </StrictMode>
);
