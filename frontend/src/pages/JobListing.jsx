import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import api from '../api/axios';

const JobListing = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [applyingTo, setApplyingTo] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, resumesRes] = await Promise.all([
          api.get('/jobs'),
          api.get('/resumes/history')
        ]);
        setJobs(jobsRes.data);
        setResumes(resumesRes.data);
        if (resumesRes.data.length > 0) {
          setSelectedResume(resumesRes.data[0]._id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleApply = async (jobId) => {
    if (!selectedResume) {
      setErrorMsg('Please upload a resume first.');
      return;
    }
    
    setApplyingTo(jobId);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await api.post(`/applications/${jobId}`, { resumeId: selectedResume });
      setSuccessMsg('Successfully applied! Your resume is being reviewed by AI.');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to apply.');
    } finally {
      setApplyingTo(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate('/candidate-dashboard')} className="flex items-center text-slate-500 hover:text-primary-600 transition mb-8">
          <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </button>

        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Available Jobs</h1>
            <p className="text-slate-500 mt-2">Find your next opportunity and apply instantly.</p>
          </div>
          
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <span className="text-sm font-medium text-slate-600">Apply using:</span>
            <select 
              value={selectedResume} 
              onChange={(e) => setSelectedResume(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2"
            >
              {resumes.length === 0 ? (
                <option value="">No resumes found</option>
              ) : (
                resumes.map(r => (
                  <option key={r._id} value={r._id}>{r.fileName}</option>
                ))
              )}
            </select>
          </div>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl flex items-center">
            <CheckCircle className="mr-2" size={20} /> {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl">
            {errorMsg}
          </div>
        )}

        <div className="grid gap-6">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition hover:shadow-md">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-800">{job.title}</h2>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full"><MapPin size={16} /> {job.location}</span>
                  <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full"><DollarSign size={16} /> {job.salary}</span>
                  <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full"><Briefcase size={16} /> {job.recruiter?.name || 'Recruiter'}</span>
                </div>
                <p className="mt-4 text-slate-600 line-clamp-2">{job.description}</p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={() => handleApply(job._id)}
                  disabled={applyingTo === job._id}
                  className="w-full md:w-auto bg-primary-600 text-white px-8 py-3 rounded-xl font-medium shadow-md hover:bg-primary-700 transition disabled:bg-slate-400 flex items-center justify-center"
                >
                  {applyingTo === job._id ? <Loader2 className="animate-spin mr-2" size={20} /> : 'Apply Now'}
                </button>
              </div>
            </div>
          ))}
          {jobs.length === 0 && (
            <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-200">
              No active jobs available at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListing;
