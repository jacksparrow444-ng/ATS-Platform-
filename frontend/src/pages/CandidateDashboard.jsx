import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, FileText, CheckCircle, Plus } from 'lucide-react';
import api from '../api/axios';

const CandidateDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/resumes/history');
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch history", err);
      }
    };
    fetchHistory();
  }, []);

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
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome, {user?.name}!</h1>
            <p className="text-slate-500">Here's an overview of your job applications and resume status.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/jobs')}
              className="bg-white text-primary-600 border border-primary-200 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-primary-50 transition"
            >
              Browse Jobs
            </button>
            <button 
              onClick={() => navigate('/upload-resume')}
              className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg hover:bg-primary-700 transition"
            >
              <Plus size={20} /> Analyze New Resume
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Uploaded Resumes</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{history.length}</h3>
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

        <h2 className="text-xl font-bold text-slate-800 mb-4">Your Resume History</h2>
        
        {history.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="max-w-md mx-auto py-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-3">No resumes uploaded yet</h2>
              <p className="text-slate-500 mb-6">Upload your resume to get an AI-powered ATS score and actionable feedback.</p>
              <button 
                onClick={() => navigate('/upload-resume')}
                className="bg-primary-50 text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-primary-100 transition"
              >
                Upload First Resume
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-gray-100 text-slate-500 text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">File Name</th>
                  <th className="px-6 py-4 font-medium">Date Uploaded</th>
                  <th className="px-6 py-4 font-medium">ATS Score</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-slate-700">
                {history.map((resume) => (
                  <tr key={resume._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                      <FileText size={18} className="text-slate-400" />
                      {resume.fileName}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        resume.atsScore >= 80 ? 'bg-green-100 text-green-700' :
                        resume.atsScore >= 60 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {resume.atsScore} / 100
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => navigate('/analysis-result', { state: { result: resume } })}
                        className="text-primary-600 font-medium hover:text-primary-700 text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default CandidateDashboard;
