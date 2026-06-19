import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, FileText, CheckCircle } from 'lucide-react';

const CandidateDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-primary-600 tracking-tight">ATS Platform</div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/profile')} className="p-2 text-gray-500 hover:text-primary-600 transition">
            <UserIcon size={20} />
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium transition">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome, {user?.name}!</h1>
        <p className="text-slate-500 mb-8">Here's an overview of your job applications and resume status.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Uploaded Resumes</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">0</h3>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="p-3 bg-green-50 text-green-500 rounded-xl">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Applications Submitted</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">0</h3>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-slate-800 mb-3">Ready to find your next role?</h2>
            <p className="text-slate-500 mb-6">Upload your resume to get an AI-powered ATS score and start applying to jobs.</p>
            <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl hover:bg-primary-700 transition">
              Upload Resume (Sprint 2)
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CandidateDashboard;
