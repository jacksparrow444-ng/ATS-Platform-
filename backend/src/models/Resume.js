import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String, // Cloudinary URL
      required: true,
    },
    parsedText: {
      type: String,
    },
    atsScore: {
      type: Number,
      required: true,
    },
    missingSkills: [
      {
        type: String,
      },
    ],
    suggestions: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
