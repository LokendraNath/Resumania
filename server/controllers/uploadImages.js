import fs from "fs";
import path from "path";

import upload from "../middleware/uploadMiddleware.js";
import Resume from "../models/resumeModel.js";

export const uploadResumeImage = async (req, res) => {
  try {
    // Configure To Multer To Handle Files
    upload.fields([{ name: "thumbnail" }, { name: "profileImage" }])(
      req,
      res,
      async (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "File Upload Failed", error: err.message });
        }
        const resumeId = req.param.id;
        const resume = await Resume.findOne({
          _id: resumeId,
          userId: req.user._id,
        });

        if (!resume) {
          return res
            .status(404)
            .json({ message: "Resume not found  or unauthorised" });
        }

        //  User Process Cwd To Locate Upload Folder
        const uploadFolder = path.join(process.cwd(), "uploads");
        const baseUrl = `${req.protocol}://${req.get("host")}`;

        const newThumbnail = req.files.thumbnail?.[0];
        const newProfileImage = req.files.profileImage?.[0];

        if (newThumbnail) {
          if (resume.thumbnailLink) {
            const oldThumbnail = path.join(
              uploadFolder,
              path.basename(resume.thumbnailLink)
            );
            if (fs.existsSync(oldThumbnail)) fs.unlinkSync(oldThumbnail);
          }
          resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.fileName}`;
        }

        // Same For profilePreview Image
        if (newProfileImage) {
          if (resume.profileInfo?.profilePreviewUrl) {
            const oldProfile = path.join(
              uploadFolder,
              path.basename(resume.profileInfo.profilePreviewUrl)
            );

            if (fs.existsSync(oldThumbnail)) fs.unlinkSync(oldThumbnail);
          }
          resume.thumbnailLink = `${baseUrl}/uploads/${newProfileImage.fileName}`;
        }
        await resume.save();
        res.status(200).json({
          message: "Image uploaded Successfully",
          thumbnailLink: resume.thumbnailLink,
          profilePreviewUrl: resume.profileInfo.profilePreviewUrl,
        });
      }
    );
  } catch (error) {
    console.error("Error uploading images", err);
    res.status(500).json({
      message: "Failed to upload images",
      error: err.message,
    });
  }
};
