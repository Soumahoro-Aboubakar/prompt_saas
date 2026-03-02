import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider, ProtectedRoute, GuestRoute } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { ToastProvider } from './components/ui/Toast';
import LandingPage from './pages/LandingPage';

// Lazy-loaded pages for code-splitting
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Formations = lazy(() => import('./pages/Formations'));
const FormationDetail = lazy(() => import('./pages/FormationDetail'));
const OAuthCallback = lazy(() => import('./pages/OAuthCallback'));
const Forbidden = lazy(() => import('./pages/Forbidden'));
const NotFound = lazy(() => import('./pages/NotFound'));
const StorePro = lazy(() => import('./pages/StorePro'));
const TemplateAdmin = lazy(() => import('./pages/admin/TemplateAdmin'));
const Suggestions = lazy(() => import('./pages/Suggestions'));

// Minimal loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProgressProvider>
          <ToastProvider>
            <Suspense fallback={<PageLoader />}>
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
           {/*      <Route path="/store-pro" element={
                  <ProtectedRoute>
                    <StorePro />
                  </ProtectedRoute>
                } />
               <Route path="/admin/store" element={
                  <ProtectedRoute>
                    <TemplateAdmin />
                  </ProtectedRoute>
                } /> */}
                <Route path="/suggestions" element={
                  <ProtectedRoute>
                    <Suggestions />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ToastProvider>
        </ProgressProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
