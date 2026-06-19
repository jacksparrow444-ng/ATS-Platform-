import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Candidate Routes */}
        <Route 
          path="/candidate-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['Candidate']}>
              <CandidateDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Recruiter Routes */}
        <Route 
          path="/recruiter-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['Recruiter']}>
              <RecruiterDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Shared Protected Routes */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute allowedRoles={['Candidate', 'Recruiter']}>
              <Profile />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
