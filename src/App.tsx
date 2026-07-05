import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Work } from './pages/Work';
import { ProjectPage } from './pages/ProjectPage';
import { Writing } from './pages/Writing';
import { ArticlePage } from './pages/ArticlePage';

export function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<ProjectPage />} />
          <Route path="/writing" element={<Writing />} />
          <Route path="/writing/:slug" element={<ArticlePage />} />
        </Route>
      </Routes>
    </>
  );
}
