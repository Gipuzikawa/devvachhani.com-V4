import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { App } from './App.tsx';
import { PreviewProvider } from './sanity/PreviewProvider';
import { ContentProvider } from './sanity/ContentProvider';
import { PreviewBanner } from './components/layout/PreviewBanner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <PreviewProvider>
        <ContentProvider>
          <PreviewBanner />
          <App />
        </ContentProvider>
      </PreviewProvider>
    </BrowserRouter>
  </StrictMode>,
);
