import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WalkPage from './pages/WalkPage';
import DestinationPage from './pages/DestinationPage';
import AdminPage from './pages/AdminPage';
import './index.css';

/** Backward-compat redirect: /walk/:id → /seattle/walk/:id */
function SeattleWalkRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/seattle/walk/${id}`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                        element={<HomePage />} />
        <Route path="/admin"                   element={<AdminPage />} />
        <Route path="/walk/:id"                element={<SeattleWalkRedirect />} />
        <Route path="/:destination"            element={<DestinationPage />} />
        <Route path="/:destination/walk/:id"   element={<WalkPage />} />
        <Route path="*"                        element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
