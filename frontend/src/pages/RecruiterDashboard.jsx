import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, Briefcase, Users } from 'lucide-react';

const RecruiterDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-primary-600 tracking-tight">ATS Platform <span className="text-sm font-normal text-slate-400 ml-2">Recruiter</span></div>
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
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome, {user?.name}!</h1>
            <p className="text-slate-500">Manage your job postings and review candidates.</p>
          </div>
          <button className="bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg hover:bg-primary-700 transition">
            + Post New Job (Sprint 3)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="p-3 bg-purple-50 text-purple-500 rounded-xl">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Active Jobs</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">0</h3>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="p-3 bg-orange-50 text-orange-500 rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Applicants</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">0</h3>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="max-w-md mx-auto py-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-3">No Active Jobs Yet</h2>
            <p className="text-slate-500">Start by creating a job posting to attract top talent. We'll automatically match and score their resumes using AI.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecruiterDashboard;
