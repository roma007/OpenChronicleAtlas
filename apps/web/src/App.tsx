import { Navigate, Route, Routes } from 'react-router-dom';
import { AtlasGalleryPage } from './pages/AtlasGalleryPage';
import { AtlasPage } from './pages/AtlasPage';
import { SearchPage } from './pages/SearchPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<AtlasGalleryPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/atlas/:atlasId" element={<AtlasPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
