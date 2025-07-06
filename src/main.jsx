// import "./monacoEnv.js"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext";
import { ProblemProvider } from './context/ProblemContext.jsx';

createRoot(document.getElementById('root')).render(

  <ProblemProvider>
      <AuthProvider>
          <StrictMode>
            <App />
          </StrictMode>
          
      </AuthProvider>
  </ProblemProvider>
)
