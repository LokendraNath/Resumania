import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    thumbnailLink: {
      type: String,
    },
    template: {
      theme: String,
      colorPalette: [String],
    },
    profileInfo: {
      profilePreviewUrl: String,
      fullname: String,
      designation: String,
      sammary: String,
    },
    profileInfo: {
      email: String,
      phone: String,
      location: String,
      linkedIn: String,
      gitHub: String,
      website: String,
    },
    // Work EXP
    workExperience: [
      {
        comapny: String,
        role: String,
        startDate: String,
        endDate: String,
        descreption: String,
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        startDate: String,
        endDate: String,
      },
    ],
    skills: [
      {
        name: String,
        progress: Number,
      },
    ],
    projects: [
      {
        title: String,
        description: String,
        gitHub: String,
        liveDemo: String,
      },
    ],
    certifications: [
      {
        title: String,
        issuer: String,
        year: String,
      },
    ],
    language: [
      {
        name: String,
        progress: Number,
      },
    ],
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

const Resume = mongoose.model("Resume", ResumeSchema);

export default Resume;
