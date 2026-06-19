import Job from '../models/Job.js';

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Recruiter)
export const createJob = async (req, res) => {
  try {
    const { title, description, requirements, location, salary } = req.body;

    if (req.user.role !== 'Recruiter') {
      return res.status(403).json({ message: 'Only recruiters can post jobs' });
    }

    const job = await Job.create({
      title,
      description,
      requirements,
      location,
      salary,
      recruiter: req.user._id,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all active jobs
// @route   GET /api/jobs
// @access  Private
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true }).populate('recruiter', 'name email');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recruiter's jobs
// @route   GET /api/jobs/recruiter
// @access  Private (Recruiter)
export const getRecruiterJobs = async (req, res) => {
  try {
    if (req.user.role !== 'Recruiter') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
