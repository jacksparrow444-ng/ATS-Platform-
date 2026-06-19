import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Job',
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Resume',
    },
    status: {
      type: String,
      enum: ['Applied', 'In Review', 'Shortlisted', 'Rejected', 'Hired'],
      default: 'Applied',
    },
    matchScore: {
      type: Number,
      required: true,
    },
    feedback: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model('Application', applicationSchema);

export default Application;
