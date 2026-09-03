import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fonts are self-hosted via Fontsource: no runtime dependency on Google's CDN,
// so the deck renders identically offline and on GitHub Pages.
import '@fontsource-variable/fraunces'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/400-italic.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
