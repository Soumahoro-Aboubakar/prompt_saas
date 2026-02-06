import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Formations from './pages/Formations';
import FormationDetail from './pages/FormationDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/formations" element={<Formations />} />
        <Route path="/formations/:id" element={<FormationDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
