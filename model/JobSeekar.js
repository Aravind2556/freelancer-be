const mongoose = require('mongoose');


// Single Job Seeker Schema
const jobSeekerSchema = new mongoose.Schema({
  // Personal Information
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  location: {
    city: { type: String },
    state: { type: String },
    country: { type: String }
  },

  // Resume/CV Details
  education: [
    {
      degree: { type: String },
      institution: { type: String },
      graduationDate: { type: Date }
    }
  ],
  workExperience: [
    {
      jobTitle: { type: String },
      companyName: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      responsibilities: { type: String }
    }
  ],
  skills: [String], // Array of skills (both hard and soft skills)
  certifications: [String], // Array of certifications or licenses
  professionalAchievements: [String], // Any additional professional achievements

  // Job Preferences
  desiredJobTitle: { type: String },
  preferredLocation: { 
    type: String, 
    enum: ['Remote', 'On-site', 'Hybrid'], 
    default: 'Remote'
  },
  desiredSalaryRange: {
    min: { type: Number },
    max: { type: Number }
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Freelance'],
    default: 'Full-time'
  },
  willingnessToRelocate: { type: Boolean, default: false },
  willingnessToTravel: { type: Boolean, default: false },

  // Job Applications
  jobApplications: [
    {
      jobTitle: { type: String },
      companyName: { type: String },
      dateOfApplication: { type: Date, default: Date.now },
      applicationStatus: {
        type: String,
        enum: ['Pending', 'Interviewed', 'Rejected', 'Accepted'],
        default: 'Pending'
      }
    }
  ],

  // Behavioral Data
  searchHistory: [String], // Types of jobs they searched for
  clickedJobPostings: [String], // Job postings clicked
  timeSpentOnPostings: [
    {
      jobId: { type: String },
      timeSpent: { type: Number } // Time in seconds
    }
  ],
  savedJobs: [String], // Array of saved job post IDs

  // Social and Professional Profiles
  linkedinProfile: { type: String },
  portfolioLink: { type: String },
  socialMediaProfiles: {
    github: { type: String },
    twitter: { type: String }
  },
  professionalAchievements: [String],

  // Assessment or Test Results
  skillTestResults: [
    {
      testName: { type: String },
      score: { type: Number },
      dateTaken: { type: Date }
    }
  ],
  responsesToApplicationQuestions: [
    {
      question: { type: String },
      answer: { type: String }
    }
  ],

  // Preferences and Notifications
  notificationPreferences: {
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false }
  },
  jobAlerts: {
    active: { type: Boolean, default: true },
    filters: {
      location: { type: String },
      jobTitle: { type: String },
      employmentType: { type: String }
    }
  }
});

// Create and export model
const JobSeeker = mongoose.model('JobSeeker', jobSeekerSchema);

module.exports = JobSeeker;
