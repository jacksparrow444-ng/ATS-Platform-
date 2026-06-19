import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ArrowLeft, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';

const AnalysisResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return <Navigate to="/candidate-dashboard" replace />;
  }

  const scoreData = [
    { name: 'Score', value: result.atsScore },
    { name: 'Remaining', value: 100 - result.atsScore },
  ];
  
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const COLORS = [getScoreColor(result.atsScore), '#f1f5f9'];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate('/candidate-dashboard')} className="flex items-center text-slate-500 hover:text-primary-600 transition mb-8">
          <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </button>

        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">ATS Analysis Result</h1>
            <p className="text-slate-500 mt-2">File: {result.fileName}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Score Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center text-center"
          >
            <h3 className="text-lg font-semibold text-slate-700 mb-4">Overall Match Score</h3>
            <div className="h-48 w-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scoreData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    {scoreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-4xl font-bold text-slate-800">{result.atsScore}</span>
                <span className="text-sm text-slate-400">/ 100</span>
              </div>
            </div>
            <p className="mt-4 text-slate-600 font-medium">
              {result.atsScore >= 80 ? 'Excellent Match! You are highly competitive.' : 
               result.atsScore >= 60 ? 'Good Match, but room for improvement.' : 
               'Low Match. Consider heavily revising your resume.'}
            </p>
          </motion.div>

          {/* Details Section */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Missing Skills */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 text-orange-500 rounded-lg">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Missing Key Skills</h3>
              </div>
              
              {result.missingSkills?.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {result.missingSkills.map((skill, idx) => (
                    <span key={idx} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium border border-slate-200">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic">No critical missing skills identified!</p>
              )}
            </motion.div>

            {/* Suggestions */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 text-blue-500 rounded-lg">
                  <Lightbulb size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Actionable Suggestions</h3>
              </div>
              
              <ul className="space-y-4">
                {result.suggestions?.map((suggestion, idx) => (
                  <li key={idx} className="flex gap-4">
                    <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 leading-relaxed">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
