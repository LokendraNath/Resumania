import { useNavigate, useParams } from "react-router-dom";
import {
  buttonStyles,
  containerStyles,
  iconStyles,
  statusStyles,
} from "../assets/dummystyle";
import DashboardLayout from "./DashboardLayout";
import { useCallback, useEffect, useRef, useState } from "react";
import { TitleInput } from "./Input";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Download,
  Loader2,
  Palette,
  Save,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import StepProgress from "./StepProgress";
import {
  ContactInfoForm,
  ProfileInfoForm,
  WorkExperienceForm,
  EducationDetailsForm,
  SkillsInfoForm,
  ProjectDetailForm,
  CertificationInfoForm,
  AdditionalInfoForm,
} from "./Forms";
import RenderResume from "./RenderResume";
import Modal from "./Model";
import { ThemeSelector } from "./ThemeSelector";
import { fixTailwindColors } from "../utils/helper";

// Helper function to convert DataURL to File
const dataURLtoFile = (dataurl, filename) => {
  if (!dataurl) {
    throw new Error("Data URL is null or undefined");
  }

  const arr = dataurl.split(",");

  if (arr.length < 2) {
    throw new Error("Invalid data URL format");
  }

  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) {
    throw new Error("Could not extract MIME type from data URL");
  }

  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

// NEW: Function to convert oklch colors to rgb for html2canvas compatibility
const convertOklchToRgb = (element) => {
  if (!element) return element;

  // Create a deep clone of the element
  const clone = element.cloneNode(true);

  // Function to convert oklch to rgb (simplified conversion)
  const oklchToRgb = (oklchValue) => {
    // This is a simplified conversion - for exact conversion you might need a library
    // For now, we'll convert common oklch values to their rgb equivalents
    const colorMap = {
      "oklch(0.5 0.2 0.1)": "rgb(128, 128, 128)",
      "oklch(0.2 0.1 0.1)": "rgb(51, 51, 51)",
      "oklch(0.8 0.1 0.1)": "rgb(204, 204, 204)",
      "oklch(0.9 0.05 0.1)": "rgb(230, 230, 230)",
      // Add more mappings as needed based on your theme colors
    };

    return colorMap[oklchValue] || "rgb(0, 0, 0)"; // Default to black if not found
  };

  // Recursive function to process all elements
  const processElement = (el) => {
    if (el.style) {
      const style = getComputedStyle(el);

      // Check and convert background color
      if (style.backgroundColor.includes("oklch")) {
        el.style.backgroundColor = oklchToRgb(style.backgroundColor);
      }

      // Check and convert color
      if (style.color.includes("oklch")) {
        el.style.color = oklchToRgb(style.color);
      }

      // Check and convert border color
      if (style.borderColor.includes("oklch")) {
        el.style.borderColor = oklchToRgb(style.borderColor);
      }
    }

    // Process children
    Array.from(el.children).forEach(processElement);
  };

  processElement(clone);
  return clone;
};

const useResizeObserver = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const ref = useCallback((node) => {
    if (node) {
      const resizeObserver = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;
        setSize({ width, height });
      });
      resizeObserver.observe(node);
      return () => resizeObserver.disconnect();
    }
  }, []);
  return { ...size, ref };
};

const EditResume = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const resumeDownloadRef = useRef(null);
  const thumbnailRef = useRef(null);

  const [openThemeSelector, setOpenThemeSelector] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("profile-info");
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [completionPercentage, setCompletionPercentage] = useState(0);

  const { width: previewWidth, ref: previewContainerRef } = useResizeObserver();

  const [resumeData, setResumeData] = useState({
    title: "Professional Resume",
    thumbnailLink: "",
    profileInfo: {
      fullName: "",
      designation: "",
      summary: "",
    },
    template: {
      theme: "modern",
      colorPalette: [],
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
        progress: 0,
      },
    ],
    interests: [""],
  });

  // Calculate completion percentage
  const calculateCompletion = useCallback(() => {
    let completedFields = 0;
    let totalFields = 0;

    // Profile Info
    totalFields += 3;
    if (resumeData.profileInfo.fullName) completedFields++;
    if (resumeData.profileInfo.designation) completedFields++;
    if (resumeData.profileInfo.summary) completedFields++;

    // Contact Info
    totalFields += 2;
    if (resumeData.contactInfo.email) completedFields++;
    if (resumeData.contactInfo.phone) completedFields++;

    // Work Experience
    resumeData.workExperience.forEach((exp) => {
      totalFields += 5;
      if (exp.company) completedFields++;
      if (exp.role) completedFields++;
      if (exp.startDate) completedFields++;
      if (exp.endDate) completedFields++;
      if (exp.description) completedFields++;
    });

    // Education
    resumeData.education.forEach((edu) => {
      totalFields += 4;
      if (edu.degree) completedFields++;
      if (edu.institution) completedFields++;
      if (edu.startDate) completedFields++;
      if (edu.endDate) completedFields++;
    });

    // Skills
    resumeData.skills.forEach((skill) => {
      totalFields += 2;
      if (skill.name) completedFields++;
      if (skill.progress > 0) completedFields++;
    });

    // Projects
    resumeData.projects.forEach((project) => {
      totalFields += 4;
      if (project.title) completedFields++;
      if (project.description) completedFields++;
      if (project.github) completedFields++;
      if (project.liveDemo) completedFields++;
    });

    // Certifications
    resumeData.certifications.forEach((cert) => {
      totalFields += 3;
      if (cert.title) completedFields++;
      if (cert.issuer) completedFields++;
      if (cert.year) completedFields++;
    });

    // Languages
    resumeData.languages.forEach((lang) => {
      totalFields += 2;
      if (lang.name) completedFields++;
      if (lang.progress > 0) completedFields++;
    });

    // Interests
    totalFields += resumeData.interests.length;
    completedFields += resumeData.interests.filter(
      (i) => i.trim() !== ""
    ).length;

    const percentage = Math.round((completedFields / totalFields) * 100);
    setCompletionPercentage(percentage);
    return percentage;
  }, [resumeData]);

  useEffect(() => {
    calculateCompletion();
  }, [calculateCompletion]);

  // Validate Inputs
  const validateAndNext = () => {
    const errors = [];

    switch (currentPage) {
      case "profile-info":
        const { fullName, designation, summary } = resumeData.profileInfo;
        if (!fullName.trim()) errors.push("Full Name is required");
        if (!designation.trim()) errors.push("Designation is required");
        if (!summary.trim()) errors.push("Summary is required");
        break;

      case "contact-info":
        const { email, phone } = resumeData.contactInfo;
        if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email))
          errors.push("Valid email is required.");
        if (!phone.trim() || !/^\d{10}$/.test(phone))
          errors.push("Valid 10-digit phone number is required");
        break;

      case "work-experience":
        resumeData.workExperience.forEach(
          ({ company, role, startDate, endDate }, index) => {
            if (!company || !company.trim())
              errors.push(`Company is required in experience ${index + 1}`);
            if (!role || !role.trim())
              errors.push(`Role is required in experience ${index + 1}`);
            if (!startDate || !endDate)
              errors.push(
                `Start and End dates are required in experience ${index + 1}`
              );
          }
        );
        break;

      case "education-info":
        resumeData.education.forEach(
          ({ degree, institution, startDate, endDate }, index) => {
            if (!degree.trim())
              errors.push(`Degree is required in education ${index + 1}`);
            if (!institution.trim())
              errors.push(`Institution is required in education ${index + 1}`);
            if (!startDate || !endDate)
              errors.push(
                `Start and End dates are required in education ${index + 1}`
              );
          }
        );
        break;

      case "skills":
        resumeData.skills.forEach(({ name, progress }, index) => {
          if (!name.trim())
            errors.push(`Skill name is required in skill ${index + 1}`);
          if (progress < 1 || progress > 100)
            errors.push(
              `Skill progress must be between 1 and 100 in skill ${index + 1}`
            );
        });
        break;

      case "projects":
        resumeData.projects.forEach(({ title, description }, index) => {
          if (!title.trim())
            errors.push(`Project Title is required in project ${index + 1}`);
          if (!description.trim())
            errors.push(
              `Project description is required in project ${index + 1}`
            );
        });
        break;

      case "certifications":
        resumeData.certifications.forEach(({ title, issuer }, index) => {
          if (!title.trim())
            errors.push(
              `Certification Title is required in certification ${index + 1}`
            );
          if (!issuer.trim())
            errors.push(`Issuer is required in certification ${index + 1}`);
        });
        break;

      case "additionalInfo":
        if (
          resumeData.languages.length === 0 ||
          !resumeData.languages[0].name?.trim()
        ) {
          errors.push("At least one language is required");
        }
        if (
          resumeData.interests.length === 0 ||
          !resumeData.interests[0]?.trim()
        ) {
          errors.push("At least one interest is required");
        }
        break;

      default:
        break;
    }

    if (errors.length > 0) {
      setErrorMsg(errors.join(", "));
      return;
    }

    setErrorMsg("");
    goToNextStep();
  };

  const goToNextStep = () => {
    const pages = [
      "profile-info",
      "contact-info",
      "work-experience",
      "education-info",
      "skills",
      "projects",
      "certifications",
      "additionalInfo",
    ];

    if (currentPage === "additionalInfo") setOpenPreviewModal(true);

    const currentIndex = pages.indexOf(currentPage);

    if (currentIndex !== -1 && currentIndex < pages.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentPage(pages[nextIndex]);

      const percent = Math.round((nextIndex / (pages.length - 1)) * 100);
      setProgress(percent);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    const pages = [
      "profile-info",
      "contact-info",
      "work-experience",
      "education-info",
      "skills",
      "projects",
      "certifications",
      "additionalInfo",
    ];

    if (currentPage === "profile-info") {
      navigate("/dashboard");
      return;
    }

    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentPage(pages[prevIndex]);

      const percent = Math.round((prevIndex / (pages.length - 1)) * 100);
      setProgress(percent);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderForm = () => {
    switch (currentPage) {
      case "profile-info":
        return (
          <ProfileInfoForm
            profileData={resumeData?.profileInfo}
            updateSection={(key, value) =>
              updateSection("profileInfo", key, value)
            }
            onNext={validateAndNext}
          />
        );

      case "contact-info":
        return (
          <ContactInfoForm
            contactInfo={resumeData?.contactInfo}
            updateSection={(key, value) =>
              updateSection("contactInfo", key, value)
            }
          />
        );

      case "work-experience":
        return (
          <WorkExperienceForm
            workExperience={resumeData?.workExperience}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("workExperience", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("workExperience", newItem)}
            removeArrayItem={(index) =>
              removeArrayItem("workExperience", index)
            }
          />
        );

      case "education-info":
        return (
          <EducationDetailsForm
            educationInfo={resumeData?.education}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("education", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("education", newItem)}
            removeArrayItem={(index) => removeArrayItem("education", index)}
          />
        );

      case "skills":
        return (
          <SkillsInfoForm
            skillsInfo={resumeData?.skills}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("skills", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("skills", newItem)}
            removeArrayItem={(index) => removeArrayItem("skills", index)}
          />
        );

      case "projects":
        return (
          <ProjectDetailForm
            projectInfo={resumeData?.projects}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("projects", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("projects", newItem)}
            removeArrayItem={(index) => removeArrayItem("projects", index)}
          />
        );

      case "certifications":
        return (
          <CertificationInfoForm
            certifications={resumeData?.certifications}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("certifications", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("certifications", newItem)}
            removeArrayItem={(index) =>
              removeArrayItem("certifications", index)
            }
          />
        );

      case "additionalInfo":
        return (
          <AdditionalInfoForm
            languages={resumeData.languages}
            interests={resumeData.interests}
            updateArrayItem={(section, index, key, value) =>
              updateArrayItem(section, index, key, value)
            }
            addArrayItem={(section, newItem) => addArrayItem(section, newItem)}
            removeArrayItem={(section, index) =>
              removeArrayItem(section, index)
            }
          />
        );

      default:
        return null;
    }
  };

  const updateSection = (section, key, value) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const updateArrayItem = (section, index, key, value) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]];

      if (key === null) {
        updatedArray[index] = value;
      } else {
        updatedArray[index] = {
          ...updatedArray[index],
          [key]: value,
        };
      }

      return {
        ...prev,
        [section]: updatedArray,
      };
    });
  };

  const addArrayItem = (section, newItem) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }));
  };

  const removeArrayItem = (section, index) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]];
      updatedArray.splice(index, 1);
      return {
        ...prev,
        [section]: updatedArray,
      };
    });
  };

  // Wrap fetchResumeDetailsById in useCallback to fix dependency warning
  const fetchResumeDetailsById = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.RESUME.GET_BY_ID(resumeId)
      );

      if (response.data && response.data.profileInfo) {
        const resumeInfo = response.data;

        setResumeData((prevState) => ({
          ...prevState,
          title: resumeInfo?.title || "Untitled",
          template: resumeInfo?.template || prevState?.template,
          profileInfo: resumeInfo?.profileInfo || prevState?.profileInfo,
          contactInfo: resumeInfo?.contactInfo || prevState?.contactInfo,
          workExperience:
            resumeInfo?.workExperience || prevState?.workExperience,
          education: resumeInfo?.education || prevState?.education,
          skills: resumeInfo?.skills || prevState?.skills,
          projects: resumeInfo?.projects || prevState?.projects,
          certifications:
            resumeInfo?.certifications || prevState?.certifications,
          languages: resumeInfo?.languages || prevState?.languages,
          interests: resumeInfo?.interests || prevState?.interests,
        }));
      }
    } catch (error) {
      console.error("Error fetching resume:", error);
      toast.error("Failed to load resume data");
    }
  }, [resumeId]);

  // NEW: Improved captureThumbnail function with oklch compatibility
  const captureThumbnail = async () => {
    const thumbnailElement = thumbnailRef.current;

    if (!thumbnailElement) {
      throw new Error("Thumbnail element not found");
    }

    // Create a temporary container for capturing
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "fixed";
    tempContainer.style.left = "0";
    tempContainer.style.top = "0";
    tempContainer.style.width = "210mm";
    tempContainer.style.height = "297mm";
    tempContainer.style.backgroundColor = "white";
    tempContainer.style.zIndex = "10000";
    tempContainer.style.opacity = "0";

    // Clone and convert oklch colors to rgb
    const clone = convertOklchToRgb(thumbnailElement);
    clone.style.display = "block";
    clone.style.visibility = "visible";
    clone.style.opacity = "1";
    clone.style.position = "relative";
    clone.style.width = "100%";
    clone.style.height = "100%";

    tempContainer.appendChild(clone);
    document.body.appendChild(tempContainer);

    try {
      const canvas = await html2canvas(tempContainer, {
        scale: 0.2,
        backgroundColor: "#FFFFFF",
        useCORS: true,
        allowTaint: false,
        logging: false,
        // Add ignore elements that might cause issues
        ignoreElements: (element) => {
          return element.tagName === "SCRIPT" || element.tagName === "STYLE";
        },
      });

      return canvas;
    } finally {
      // Always cleanup the temporary container
      if (tempContainer.parentNode) {
        tempContainer.parentNode.removeChild(tempContainer);
      }
    }
  };

  // FIXED: uploadResumeImages function
  const uploadResumeImages = async () => {
    try {
      setIsLoading(true);

      // Use the new captureThumbnail function
      const thumbnailCanvas = await captureThumbnail();

      if (!thumbnailCanvas) {
        throw new Error("Failed to create canvas");
      }

      const thumbnailDataUrl = thumbnailCanvas.toDataURL("image/png");

      // Better validation for data URL
      if (
        !thumbnailDataUrl ||
        !thumbnailDataUrl.startsWith("data:image/png") ||
        thumbnailDataUrl.length < 1000
      ) {
        throw new Error("Generated thumbnail is invalid or too small");
      }

      const thumbnailFile = dataURLtoFile(
        thumbnailDataUrl,
        `thumbnail-${resumeId}.png`
      );

      const formData = new FormData();
      formData.append("thumbnail", thumbnailFile);

      const uploadResponse = await axiosInstance.put(
        API_PATHS.RESUME.UPLOAD_IMAGES(resumeId),
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const { thumbnailLink } = uploadResponse.data;
      await updateResumeDetails(thumbnailLink);

      toast.success("Resume Updated Successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error Uploading Images:", error);
      toast.error("Failed to upload images: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateResumeDetails = async (thumbnailLink) => {
    try {
      setIsLoading(true);

      await axiosInstance.put(API_PATHS.RESUME.UPDATE(resumeId), {
        ...resumeData,
        thumbnailLink: thumbnailLink || "",
        completion: completionPercentage,
      });
    } catch (err) {
      console.error("Error updating resume:", err);
      toast.error("Failed to update resume details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteResume = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeId));
      toast.success("Resume deleted successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast.error("Failed to delete resume");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = async () => {
    const element = resumeDownloadRef.current;
    if (!element) {
      toast.error("Failed to generate PDF. Please try again.");
      return;
    }

    setIsDownloading(true);
    setDownloadSuccess(false);
    const toastId = toast.loading("Generating PDF…");

    // Create a clone and convert oklch colors for PDF generation
    const pdfClone = convertOklchToRgb(element);
    pdfClone.style.position = "relative";
    pdfClone.style.width = getComputedStyle(element).width;

    // Inline computed styles (so external CSS and variables are preserved)
    const inlineAllStyles = (root) => {
      const nodes = [root, ...root.querySelectorAll("*")];
      nodes.forEach((node) => {
        try {
          const cs = getComputedStyle(node);
          // Build cssText from computed styles (selected subset to avoid huge strings)
          let cssText = "";
          for (let i = 0; i < cs.length; i++) {
            const prop = cs[i];
            // skip some properties that can break layout in print
            if (/[\-]?(animation|transition|perspective|cursor)/i.test(prop))
              continue;
            cssText += `${prop}: ${cs.getPropertyValue(prop)}; `;
          }
          node.style.cssText = cssText;
        } catch (e) {
          // ignore nodes we can't compute
        }
      });
    };

    // Wait for fonts and images to load to avoid rendering differences
    const waitForResources = async (root) => {
      try {
        await document.fonts?.ready;
      } catch (e) {
        /* ignore */
      }

      const imgs = Array.from(root.querySelectorAll("img"));
      await Promise.all(
        imgs.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((res) => (img.onload = img.onerror = res));
        })
      );
    };

    // Append clone to DOM (offscreen) so canvas can render it
    const originalParent = element.parentNode;
    const originalDisplay = element.style.display;
    element.style.visibility = "hidden";
    originalParent.appendChild(pdfClone);

    try {
      // Inline styles and wait for resources
      inlineAllStyles(pdfClone);
      await waitForResources(pdfClone);

      // Use a higher scale for better fidelity. If you hit memory issues, reduce scale.
      const scale = Math.min(3, window.devicePixelRatio || 2);

      await html2pdf()
        .set({
          margin: 0,
          filename: `${resumeData.title.replace(/[^a-z0-9]/gi, "_")}.pdf`,
          image: { type: "png", quality: 1.0 },
          html2canvas: {
            scale,
            useCORS: true,
            backgroundColor: "#FFFFFF",
            logging: false,
            windowWidth: Math.max(pdfClone.scrollWidth, pdfClone.offsetWidth),
            windowHeight: Math.max(
              pdfClone.scrollHeight,
              pdfClone.offsetHeight
            ),
            scrollX: 0,
            scrollY: 0,
            ignoreElements: (el) => el.tagName === "SCRIPT",
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },
          pagebreak: {
            mode: ["css", "legacy"],
          },
        })
        .from(pdfClone)
        .save();

      toast.success("PDF downloaded successfully!", { id: toastId });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error("PDF error:", err);
      toast.error(`Failed to generate PDF: ${err.message}`, { id: toastId });
    } finally {
      // Cleanup
      if (pdfClone.parentNode) pdfClone.parentNode.removeChild(pdfClone);
      element.style.visibility = "visible";
      setIsDownloading(false);
    }
  };

  const updateTheme = (theme) => {
    setResumeData((prev) => ({
      ...prev,
      template: {
        ...prev.template,
        theme: theme,
      },
    }));
  };

  useEffect(() => {
    if (resumeId) {
      fetchResumeDetailsById();
    }
  }, [resumeId, fetchResumeDetailsById]);

  return (
    <DashboardLayout>
      <div className={containerStyles.main}>
        <div className={containerStyles.header}>
          <TitleInput
            title={resumeData.title}
            setTitle={(value) =>
              setResumeData((prev) => ({
                ...prev,
                title: value,
              }))
            }
          />

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setOpenThemeSelector((prev) => !prev)}
              className={buttonStyles.theme}
            >
              <Palette size={16} />
              <span className="text-sm">Theme</span>
            </button>
            <button
              onClick={handleDeleteResume}
              className={buttonStyles.delete}
              disabled={isLoading}
            >
              <Trash2 size={16} />
              <span className="text-sm">Delete</span>
            </button>

            <button
              onClick={() => setOpenPreviewModal(true)}
              className={buttonStyles.download}
            >
              <Download size={16} />
              <span className="text-sm">Preview</span>
            </button>
          </div>
        </div>

        <div className={containerStyles.grid}>
          <div className={containerStyles.formContainer}>
            <StepProgress progress={progress} />
            {renderForm()}
            <div className="p-4 sm:p-6">
              {errorMsg && (
                <div className={statusStyles.error}>
                  <AlertCircle size={16} />
                  {errorMsg}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-end gap-3">
                <button
                  className={buttonStyles.back}
                  onClick={goBack}
                  disabled={isLoading}
                >
                  <ArrowLeft size={16} />
                  Back
                </button>

                <button
                  className={buttonStyles.save}
                  onClick={uploadResumeImages}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {isLoading ? "Saving ..." : "Save & Exit"}
                </button>

                <button
                  className={buttonStyles.next}
                  onClick={validateAndNext}
                  disabled={isLoading}
                >
                  {currentPage === "additionalInfo" && <Download size={16} />}
                  {currentPage === "additionalInfo"
                    ? "Preview & Download"
                    : "Next"}
                  {currentPage === "additionalInfo" && (
                    <ArrowLeft size={16} className="rotate-180" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className={containerStyles.previewContainer}>
              <div className="text-center mb-4">
                <div className={statusStyles.completionBadge}>
                  <div className={iconStyles.pulseDot}></div>
                  <span>Preview - {completionPercentage}% Complete</span>
                </div>
              </div>

              <div
                className="preview-container relative"
                ref={previewContainerRef}
              >
                <div className={containerStyles.previewInner}>
                  <RenderResume
                    key={`preview-${resumeData?.template?.theme}`}
                    templateId={resumeData?.template?.theme || ""}
                    resumeData={resumeData}
                    containerWidth={previewWidth}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openThemeSelector}
        onClose={() => setOpenThemeSelector(false)}
        title="Change Theme"
      >
        <div className={containerStyles.modalContent}>
          <ThemeSelector
            selectedTheme={resumeData?.template?.theme}
            setSelectedTheme={updateTheme}
            onClose={() => setOpenThemeSelector(false)}
          />
        </div>
      </Modal>

      <Modal
        isOpen={openPreviewModal}
        onClose={() => setOpenPreviewModal(false)}
        title={resumeData.title}
        showActionBtn
        actionBtnText={
          isDownloading
            ? "Generating ..."
            : downloadSuccess
            ? "Downloaded!"
            : "Download PDF"
        }
        actionBtnIcon={
          isDownloading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : downloadSuccess ? (
            <Check size={16} className="text-white" />
          ) : (
            <Download size={16} />
          )
        }
        onActionClick={downloadPDF}
      >
        <div className="relative">
          <div className="text-center mb-4">
            <div className={statusStyles.modalBadge}>
              <div className={iconStyles.pulseDot}></div>
              <span>Completion: {completionPercentage}%</span>
            </div>
          </div>

          <div className={containerStyles.pdfPreview}>
            <div ref={resumeDownloadRef} className="a4-wrapper">
              <div className="w-full h-full">
                <RenderResume
                  key={`pdf-${resumeData?.template?.theme}`}
                  templateId={resumeData?.template?.theme || ""}
                  resumeData={resumeData}
                  containerWidth={null}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <div style={{ display: "none" }} ref={thumbnailRef}>
        <div className={containerStyles.hiddenThumbnail}>
          <RenderResume
            key={`thumb-${resumeData?.template?.theme}`}
            templateId={resumeData?.template?.theme || ""}
            resumeData={resumeData}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditResume;
