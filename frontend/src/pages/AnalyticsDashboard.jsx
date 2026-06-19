import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../api/axios';

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialJobId = queryParams.get('jobId');

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(initialJobId || '');
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    // Fetch recruiter's jobs
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/jobs/recruiter');
        setJobs(data);
        if (data.length > 0 && !selectedJob) {
          setSelectedJob(data[0]._id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJob) {
      const fetchApplicants = async () => {
        try {
          const { data } = await api.get(`/applications/job/${selectedJob}`);
          setApplicants(data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchApplicants();
    }
  }, [selectedJob]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await api.put(`/applications/${appId}/status`, { status: newStatus });
      setApplicants(applicants.map(app => app._id === appId ? { ...app, status: newStatus } : app));
    } catch (err) {
      console.error(err);
    }
  };

  const stats = {
    total: applicants.length,
    hired: applicants.filter(a => a.status === 'Hired').length,
    rejected: applicants.filter(a => a.status === 'Rejected').length,
    inReview: applicants.filter(a => ['Applied', 'In Review', 'Shortlisted'].includes(a.status)).length,
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate('/recruiter-dashboard')} className="flex items-center text-slate-500 hover:text-primary-600 transition mb-8">
          <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Analytics & Applicants</h1>
            <p className="text-slate-500 mt-2">View AI match scores and manage application statuses.</p>
          </div>
          
          <select 
            value={selectedJob} 
            onChange={(e) => setSelectedJob(e.target.value)}
            className="bg-white border border-slate-300 text-slate-700 rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-3 shadow-sm w-full md:w-auto min-w-[250px]"
          >
            {jobs.length === 0 ? <option value="">No jobs available</option> : null}
            {jobs.map(job => (
              <option key={job._id} value={job._id}>{job.title}</option>
            ))}
          </select>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
            <p className="text-slate-500 text-sm font-medium mb-1">Total Applicants</p>
            <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
            <p className="text-slate-500 text-sm font-medium mb-1">In Pipeline</p>
            <p className="text-3xl font-bold text-blue-600">{stats.inReview}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
            <p className="text-slate-500 text-sm font-medium mb-1">Hired</p>
            <p className="text-3xl font-bold text-green-600">{stats.hired}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
            <p className="text-slate-500 text-sm font-medium mb-1">Rejected</p>
            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>

        {/* Applicants List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
            <h3 className="text-lg font-bold text-slate-800">Applicant Pipeline (AI Ranked)</h3>
          </div>
          
          {applicants.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No applicants for this job yet.</div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {applicants.map((app) => (
                <li key={app._id} className="p-6 flex flex-col md:flex-row justify-between items-center gap-6 hover:bg-slate-50 transition">
                  <div className="flex-1 w-full flex items-center gap-6">
                    <div className="relative">
                      {/* Circular Progress for AI Score */}
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="175.9" strokeDashoffset={175.9 - (175.9 * app.matchScore) / 100} className={app.matchScore >= 80 ? 'text-green-500' : app.matchScore >= 60 ? 'text-yellow-500' : 'text-red-500'} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-sm font-bold text-slate-800">{app.matchScore}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-bold text-slate-800">{app.candidate.name}</h4>
                      <p className="text-sm text-slate-500 mb-2">{app.candidate.email}</p>
                      <a href={app.resume?.fileUrl} target="_blank" rel="noreferrer" className="text-primary-600 text-sm font-medium hover:underline">View Resume PDF</a>
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      app.status === 'Applied' ? 'bg-slate-100 text-slate-600' :
                      app.status === 'In Review' || app.status === 'Shortlisted' ? 'bg-blue-100 text-blue-700' :
                      app.status === 'Hired' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {app.status}
                    </span>
                    
                    <select 
                      value={app.status}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2 shadow-sm"
                    >
                      <option value="Applied">Applied</option>
                      <option value="In Review">In Review</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Hired">Hired</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
