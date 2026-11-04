import { Navigate, Route, Routes } from 'react-router-dom';
import { OfflineBanner } from './components/layout/OfflineBanner';
import { SkipLink } from './components/layout/SkipLink';
import { PwaUpdatePrompt } from './components/layout/PwaUpdatePrompt';
import { AboutPage } from './pages/AboutPage';
import { AtlasGalleryPage } from './pages/AtlasGalleryPage';
import { AtlasPage } from './pages/AtlasPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { SearchPage } from './pages/SearchPage';

export function App() {
  return (
    <>
      <SkipLink />
      <OfflineBanner />
      <PwaUpdatePrompt />
      <Routes>
        <Route path="/" element={<AtlasGalleryPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/atlas/:atlasId" element={<AtlasPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
