import pdfParse from 'pdf-parse';
import cloudinary from '../config/cloudinary.js';
import { analyzeResumeWithGemini } from '../services/aiService.js';
import Resume from '../models/Resume.js';
import streamifier from 'streamifier';

// @desc    Upload resume, parse PDF, analyze with AI, and save
// @route   POST /api/resumes/upload
// @access  Private (Candidate)
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    // 1. Upload to Cloudinary using stream
    let cloudResult = null;
    try {
      cloudResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'ats_resumes', format: 'pdf' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });
    } catch (err) {
      console.warn("Cloudinary upload failed (possibly missing keys), continuing without URL.");
      cloudResult = { secure_url: "https://placeholder.url/resume.pdf" };
    }

    // 2. Parse PDF Text
    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text;

    // 3. Analyze with Gemini AI
    const analysisResult = await analyzeResumeWithGemini(text);

    // 4. Save to Database
    const resume = await Resume.create({
      user: req.user._id,
      fileName: req.file.originalname,
      fileUrl: cloudResult.secure_url,
      parsedText: text,
      atsScore: analysisResult.score,
      missingSkills: analysisResult.missingSkills,
      suggestions: analysisResult.suggestions,
    });

    res.status(201).json(resume);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing resume', error: error.message });
  }
};

// @desc    Get user's uploaded resumes
// @route   GET /api/resumes/history
// @access  Private
export const getResumeHistory = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
