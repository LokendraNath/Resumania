import fs from "fs";
import path from "path";
import Resume from "../models/resumeModel.js";

export const createResume = async (req, res) => {
  try {
    const { title } = req.body;

    // Default template
    const defaultResumeData = {
      profileInfo: {
        profileImg: null,
        previewUrl: "",
        fullName: "",
        designation: "",
        summary: "",
      },
      contactInfo: {
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        website: "",
      },
      workExperience: [
        {
          company: "",
          role: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
      education: [
        {
          degree: "",
          institution: "",
          startDate: "",
          endDate: "",
        },
      ],
      skills: [
        {
          name: "",
          progress: 0,
        },
      ],
      projects: [
        {
          title: "",
          description: "",
          github: "",
          liveDemo: "",
        },
      ],
      certifications: [
        {
          title: "",
          issuer: "",
          year: "",
        },
      ],
      languages: [
        {
          name: "",
          progress: "",
        },
      ],
      interests: [""],
    };
    const newResume = await Resume.create({
      userId: req.user._id,
      title,
      ...structuredClone(defaultResumeData),
      ...req.body,
    });
    res.status(201).json(newResume);
  } catch (error) {
    res
      .status(500)
      .json({ resume: "Failed To Create Resume", error: error.message });
  }
};

// Get Functions
export const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({
      updatedAt: -1,
    });
    res.json(resumes);
  } catch (error) {
    res
      .status(500)
      .json({ resume: "Failed To Get Resumes", error: error.message });
  }
};

// Get Resume By Id
export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!resume) {
      res.status(500).json({ message: "Resume Not Found" });
    }
    res.json(resume);
  } catch (error) {
    res
      .status(500)
      .json({ resume: "Failed To Get Resumes", error: error.message });
  }
};

// Update Resume
export const updatedResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!resume)
      return res
        .status(400)
        .json({ message: "Resume Not Found or Not Authorize" });

    // Merge Update Resume
    Object.assign(resume, req.body);
    // Save Update Resume
    const savedResume = await resume.save();
    res.send(savedResume);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed To Update Resume", error: error.message });
  }
};

// Delete Resume

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    // Create a Upload Folder and Store in Their
    const uploadFolder = path.join(process.cwd(), "uploads");

    // Delete Thumbnail Functions
    if (resume.thumbnailLink) {
      const oldThumbnail = path.join(
        uploadFolder,
        path.basename(resume.thumbnailLink)
      );
      if (fs.existsSync(oldThumbnail)) {
        fs.unlinkSync(oldThumbnail);
      }
    }

    if (resume.profileInfo?.previewUrl) {
      const oldProfile = path.join(
        uploadFolder,
        path.basename(resume.profileInfo.profilePreviewUrl)
      );
      if (fs.existsSync(oldProfile)) {
        fs.unlinkSync(oldProfile);
      }
    }

    // Delete Resume Doc
    const deleted = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deleted) {
      res.status(404).json({ message: "Resume not found or not Authorize" });
    }

    res.json({ message: "Resume Deleted Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed To Delete Resume", error: error.message });
  }
};
