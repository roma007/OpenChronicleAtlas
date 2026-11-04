import { Navigate, Route, Routes } from 'react-router-dom';
import { OfflineBanner } from './components/layout/OfflineBanner';
import { AtlasGalleryPage } from './pages/AtlasGalleryPage';
import { AtlasPage } from './pages/AtlasPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { SearchPage } from './pages/SearchPage';

export function App() {
  return (
    <>
      <OfflineBanner />
      <Routes>
        <Route path="/" element={<AtlasGalleryPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/atlas/:atlasId" element={<AtlasPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
