import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const { data } = await api.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Redirect to the result page with the analysis data
      navigate('/analysis-result', { state: { result: data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Error analyzing resume. Please try again.');
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto mt-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">AI Resume Analysis</h1>
          <p className="mt-2 text-slate-500">Upload your PDF resume to get an instant ATS score and actionable feedback.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
              isDragActive ? 'border-primary-500 bg-primary-50' : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50'
            }`}
          >
            <input {...getInputProps()} />
            
            {!file ? (
              <div className="flex flex-col items-center">
                <div className="bg-primary-100 text-primary-600 p-4 rounded-full mb-4">
                  <UploadCloud size={32} />
                </div>
                <p className="text-lg font-medium text-slate-700">Drag & drop your PDF resume here</p>
                <p className="text-sm text-slate-500 mt-2">or click to browse files (Max 5MB)</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="bg-green-100 text-green-600 p-4 rounded-full mb-4">
                  <FileText size={32} />
                </div>
                <p className="text-lg font-medium text-slate-800">{file.name}</p>
                <p className="text-sm text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="mt-4 text-sm text-red-500 hover:text-red-700 font-medium"
                >
                  Remove file
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-6 flex items-center p-4 bg-red-50 text-red-700 rounded-lg">
              <AlertCircle size={20} className="mr-3 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className={`w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-medium text-white transition-all ${
                !file || isUploading ? 'bg-slate-300 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 hover:shadow-xl'
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Analyzing with Gemini AI...
                </>
              ) : (
                'Analyze My Resume'
              )}
            </button>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <button onClick={() => navigate('/candidate-dashboard')} className="text-slate-500 hover:text-slate-700 transition">
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
