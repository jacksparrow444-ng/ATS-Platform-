import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, Briefcase, Users, Plus, BarChart2 } from 'lucide-react';
import api from '../api/axios';

const RecruiterDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', description: '', requirements: '', location: '', salary: '' });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get('/jobs/recruiter');
      setJobs(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await api.post('/jobs', newJob);
      setShowModal(false);
      setNewJob({ title: '', description: '', requirements: '', location: '', salary: '' });
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-primary-600 tracking-tight">ATS Platform <span className="text-sm font-normal text-slate-400 ml-2">Recruiter</span></div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/analytics')} className="flex items-center gap-2 px-3 py-1.5 text-slate-600 hover:text-primary-600 font-medium transition bg-slate-100 hover:bg-primary-50 rounded-lg">
            <BarChart2 size={18} /> Analytics
          </button>
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
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg hover:bg-primary-700 transition"
          >
            <Plus size={20} /> Post New Job
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="p-3 bg-purple-50 text-purple-500 rounded-xl">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Active Jobs</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{jobs.length}</h3>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-800 mb-4">Your Job Postings</h2>
        
        {jobs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="max-w-md mx-auto py-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-3">No Active Jobs Yet</h2>
              <p className="text-slate-500">Start by creating a job posting to attract top talent. We'll automatically match and score their resumes using AI.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map(job => (
              <div key={job._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{job.title}</h3>
                  <p className="text-slate-500 text-sm mt-1">{new Date(job.createdAt).toLocaleDateString()} • {job.location}</p>
                </div>
                <button 
                  onClick={() => navigate(`/analytics?jobId=${job._id}`)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2 rounded-lg transition"
                >
                  View Applicants
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal for Creating Job */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Post a New Job</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
            </div>
            <form onSubmit={handleCreateJob} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                <input required type="text" className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input required type="text" className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-primary-500" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} placeholder="e.g. Remote, NY" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Salary Range</label>
                  <input required type="text" className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-primary-500" value={newJob.salary} onChange={e => setNewJob({...newJob, salary: e.target.value})} placeholder="e.g. $100k - $120k" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea required rows="3" className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-primary-500" value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})}></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Requirements (Skills)</label>
                <textarea required rows="2" className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-primary-500" value={newJob.requirements} onChange={e => setNewJob({...newJob, requirements: e.target.value})} placeholder="e.g. React, Node.js, 3+ years experience"></textarea>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-slate-600 font-medium bg-slate-100 hover:bg-slate-200 rounded-lg transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-white font-medium bg-primary-600 hover:bg-primary-700 shadow-md rounded-lg transition">Post Job</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
