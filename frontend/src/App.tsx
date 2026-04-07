import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/:alias" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
