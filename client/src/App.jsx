import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { ToastProvider } from './components/ui/Toast';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import Formations from './pages/Formations';
import FormationDetail from './pages/FormationDetail';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProgressProvider>
          <ToastProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/formations" element={
                <ProtectedRoute>
                  <Formations />
                </ProtectedRoute>
              } />
              <Route path="/formations/:id" element={
                <ProtectedRoute>
                  <FormationDetail />
                </ProtectedRoute>
              } />
            </Routes>
          </ToastProvider>
        </ProgressProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
