import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Profile = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleBack = () => {
    if (user?.role === 'Candidate') navigate('/candidate-dashboard');
    else navigate('/recruiter-dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button onClick={handleBack} className="flex items-center text-slate-500 hover:text-primary-600 transition mb-6">
          <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </button>
        
        <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-12">
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center text-primary-600 text-4xl font-bold shadow-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold">{user?.name}</h1>
                <p className="text-primary-100 text-lg">{user?.role}</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Account Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-500">Email Address</label>
                <div className="mt-1 p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                  {user?.email}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500">Account Type</label>
                <div className="mt-1 p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                  {user?.role}
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-100">
              <button className="bg-primary-50 text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-100 transition">
                Edit Profile (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
