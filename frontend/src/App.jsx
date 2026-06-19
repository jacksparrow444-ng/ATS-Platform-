import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import Profile from './pages/Profile';
import ResumeUpload from './pages/ResumeUpload';
import AnalysisResult from './pages/AnalysisResult';
import JobListing from './pages/JobListing';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
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
        <Route 
          path="/upload-resume" 
          element={
            <ProtectedRoute allowedRoles={['Candidate']}>
              <ResumeUpload />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analysis-result" 
          element={
            <ProtectedRoute allowedRoles={['Candidate']}>
              <AnalysisResult />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/jobs" 
          element={
            <ProtectedRoute allowedRoles={['Candidate']}>
              <JobListing />
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
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute allowedRoles={['Recruiter']}>
              <AnalyticsDashboard />
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
