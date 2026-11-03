import { Navigate, Route, Routes } from 'react-router-dom';
import { AtlasGalleryPage } from './pages/AtlasGalleryPage';
import { AtlasPage } from './pages/AtlasPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<AtlasGalleryPage />} />
      <Route path="/atlas/:atlasId" element={<AtlasPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
