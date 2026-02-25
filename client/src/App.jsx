import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, ProtectedRoute, GuestRoute } from './context/AuthContext';
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
import OAuthCallback from './pages/OAuthCallback';
import Forbidden from './pages/Forbidden';
import NotFound from './pages/NotFound';
import StorePro from './pages/StorePro';
import Suggestions from './pages/Suggestions';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProgressProvider>
          <ToastProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth/callback" element={<OAuthCallback />} />
              <Route path="/login" element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              } />
              <Route path="/signup" element={
                <GuestRoute>
                  <SignUp />
                </GuestRoute>
              } />
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
              <Route path="/store-pro" element={
                <ProtectedRoute>
                  <StorePro />
                </ProtectedRoute>
              } />
              <Route path="/suggestions" element={
                <ProtectedRoute>
                  <Suggestions />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ToastProvider>
        </ProgressProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
