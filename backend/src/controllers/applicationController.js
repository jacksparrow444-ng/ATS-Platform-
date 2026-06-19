import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Resume from '../models/Resume.js';
import { calculateMatchScore } from '../services/aiService.js';
import { sendEmail } from '../services/emailService.js';

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Candidate)
export const applyForJob = async (req, res) => {
  try {
    const { resumeId } = req.body;
    const jobId = req.params.jobId;

    if (req.user.role !== 'Candidate') {
      return res.status(403).json({ message: 'Only candidates can apply' });
    }

    // Check if already applied
    const existing = await Application.findOne({ job: jobId, candidate: req.user._id });
    if (existing) return res.status(400).json({ message: 'Already applied to this job' });

    const job = await Job.findById(jobId);
    const resume = await Resume.findById(resumeId);

    if (!job || !resume) return res.status(404).json({ message: 'Job or Resume not found' });

    // AI Match Calculation
    const matchResult = await calculateMatchScore(resume.parsedText, job.description + " " + job.requirements);

    const application = await Application.create({
      job: jobId,
      candidate: req.user._id,
      resume: resumeId,
      matchScore: matchResult.matchPercentage,
    });

    // Send Email to Candidate
    await sendEmail({
      to: req.user.email,
      subject: `Application Received: ${job.title}`,
      text: `Hi ${req.user.name},\n\nWe have received your application for the ${job.title} role. Your resume is being processed.\n\nBest,\nATS Platform`
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get applicants for a job
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter)
export const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email')
      .populate('resume', 'fileUrl atsScore missingSkills')
      .sort({ matchScore: -1 }); // Sort by best AI match

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('candidate');

    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.status = status;
    await application.save();

    // Notify candidate
    await sendEmail({
      to: application.candidate.email,
      subject: `Status Update: ${application.job.title}`,
      text: `Hi ${application.candidate.name},\n\nYour application status for ${application.job.title} has been updated to: ${status}.\n\nBest,\nATS Platform`
    });

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
