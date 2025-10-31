import { useEffect, useState } from "react";
import { dashboardStyles as styles } from "../assets/dummystyle";
import DashboardLayout from "../components/DashboardLayout";
import { LucideFilePlus, LucideTrash2 } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { ResumeSummaryCard } from "../components/Card";

import moment from "moment";
import toast from "react-hot-toast";
import Modal from "../components/Model";
import CreateResumeForm from "../components/CreateResumeForm";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [openCreateModle, setOpenCreateModle] = useState(null);
  const [allResumes, setAllResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  // Calculate Completion Percentage For A Resume
  const calculateCompletion = (resume) => {
    let completedFields = 0;
    let totalFields = 0;

    // Profile Info
    totalFields += 3;
    if (resume.profileInfo?.fullName) completedFields++;
    if (resume.profileInfo?.designation) completedFields++;
    if (resume.profileInfo?.summary) completedFields++;

    // Contact Info
    totalFields += 2;
    if (resume.contactInfo?.email) completedFields++;
    if (resume.contactInfo?.phone) completedFields++;

    // Work Experience
    resume.workExperience?.forEach((exp) => {
      totalFields += 5;
      if (exp.company) completedFields++;
      if (exp.role) completedFields++;
      if (exp.startDate) completedFields++;
      if (exp.endDate) completedFields++;
      if (exp.description) completedFields++;
    });

    // Education
    resume.education?.forEach((edu) => {
      totalFields += 4;
      if (edu.degree) completedFields++;
      if (edu.institution) completedFields++;
      if (edu.startDate) completedFields++;
      if (edu.endDate) completedFields++;
    });

    // Skills
    resume.skills?.forEach((skill) => {
      totalFields += 2;
      if (skill.name) completedFields++;
      if (skill.progress > 0) completedFields++;
    });

    // Projects
    resume.projects?.forEach((project) => {
      totalFields += 4;
      if (project.title) completedFields++;
      if (project.description) completedFields++;
      if (project.github) completedFields++;
      if (project.liveDemo) completedFields++;
    });

    // Certifications
    resume.certifications?.forEach((cert) => {
      totalFields += 3;
      if (cert.title) completedFields++;
      if (cert.issuer) completedFields++;
      if (cert.year) completedFields++;
    });

    // Languages
    resume.languages?.forEach((lang) => {
      totalFields += 2;
      if (lang.name) completedFields++;
      if (lang.progress > 0) completedFields++;
    });

    // Interests
    totalFields += resume.interests?.length || 0;
    completedFields +=
      resume.interests?.filter((i) => i?.trim() !== "")?.length || 0;

    return Math.round((completedFields / totalFields) * 100);
  };

  const fetchAllResumes = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_PATHS.RESUME.GET_ALL);
      // Add Completion Percentage To Each resumes
      const resumeWithCompletion = res.data.map((resume) => ({
        ...resume,
        completion: calculateCompletion(resume),
      }));
      setAllResumes(resumeWithCompletion);
    } catch (error) {
      console.error("Error Fetching Resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllResumes();
  }, []);

  const handleDeleteResume = async () => {
    if (!resumeToDelete) return;

    try {
      await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeToDelete));
      toast.success("Resume Delete Successfully");
      fetchAllResumes();
    } catch (error) {
      console.error("Error deleting resume:", error);
    } finally {
      setResumeToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteClick = (id) => {
    setResumeToDelete(id);
    setShowDeleteConfirm(true);
  };

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <div className={styles.headerWrapper}>
          <div>
            <h1 className={styles.headerTitle}>My Resume</h1>
            <p className={styles.headerSubtitle}>
              {allResumes.length > 0
                ? `You have ${allResumes.length} resumes ${
                    allResumes.length !== 1 ? "s" : ""
                  }`
                : "Start Building Your Proffesional Resume"}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setOpenCreateModle(true)}
              className={styles.createButton}
            >
              <div className={styles.createButtonOverlay}></div>
              <span className={styles.createButtonContent}>
                Create Now{" "}
                <LucideFilePlus
                  className="group-hover:translate-x-1 transition-transform"
                  size={18}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Loading States */}
        {!loading && allResumes.length === 0 && (
          <div className={styles.emptyStateWrapper}>
            <div className={styles.emptyIconWrapper}>
              <LucideFilePlus size={32} className="text-blue-600" />
            </div>
            <h3 className={styles.emptyTitle}>No Resume Yet</h3>
            <p className={styles.emptyText}>
              You haven't created any resumes yet. Start building your
              professional resume to land your dream job.
            </p>
            <button
              className={styles.createButton}
              onClick={() => setOpenCreateModle(true)}
            >
              <div className={styles.createButtonOverlay}></div>
              <span className={styles.createButtonContent}>
                Create Your First Resume
                <LucideFilePlus
                  className="group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </span>
            </button>
          </div>
        )}

        {/* Grid View */}
        {!loading && allResumes.length > 0 && (
          <div className={styles.grid}>
            <div
              className={styles.newResumeCard}
              onClick={() => setOpenCreateModle(true)}
            >
              <div className={styles.newResumeIcon}>
                <LucideFilePlus size={32} className="text-white" />
              </div>
              <h3 className={styles.newResumeTitle}>Create New Resume</h3>
              <p className={styles.newResumeText}>Start building Your Career</p>
            </div>

            {allResumes.map((resume) => (
              <ResumeSummaryCard
                key={resume._id}
                imgUrl={resume.thumbnailLink}
                title={resume.title}
                createdAt={resume.createdAt}
                updatedAt={resume.updatedAt}
                onSelect={() => navigate(`/resume/${resume._id}`)}
                onDelete={() => handleDeleteClick(resume._id)}
                completion={resume.completion || 0}
                isPremium={resume.isPremium}
                isNew={moment().diff(moment(resume.createdAt), "days") < 7}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={openCreateModle}
        onClose={() => setOpenCreateModle(false)}
        hideHeader
        maxWidth="max-w-2xl"
      >
        <div className="p-6">
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>Create New Resume</h3>
            <button
              onClick={() => setOpenCreateModle(false)}
              className={styles.modalCloseButton}
            >
              X
            </button>
          </div>
          <CreateResumeForm
            onSuccess={() => {
              setOpenCreateModle(false);
              fetchAllResumes();
            }}
          />
        </div>
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirm Delete"
        showActionBtn
        actionBtnText="Delete"
        actionBtnClassName="bg-red-600 hover:bg-red-700"
        onActionClick={handleDeleteResume}
      >
        <div className="p-4">
          <div className="flex flex-col items-center text-center">
            <div className={styles.deleteIconWrapper}>
              <LucideTrash2 className="text-orange-600" size={24} />
            </div>
            <h3 className={styles.deleteTitle}>Delete Resume?</h3>
            <p className={styles.deleteText}>
              Are Your Sure You Want To Delete This Resume? This action cannot
              Be undone.
            </p>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};
export default Dashboard;
