import {
  ArrowRight,
  BrickWall,
  Download,
  LayoutTemplate,
  Menu,
  X,
  Zap,
} from "lucide-react";

import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import { ProfileInfoCard } from "../components/Card.jsx";
import { landingPageStyles } from "../assets/dummystyle.js";
import Modal from "../components/Model.jsx";
import Login from "../components/Login.jsx";
import SignUp from "../components/SignUp.jsx";

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openAuthModle, setOpenAuthModle] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModle(true);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className={landingPageStyles.container}>
      {/* Header Section */}
      <header className={landingPageStyles.header}>
        <div className={landingPageStyles.headerContainer}>
          <div className={landingPageStyles.logoContainer}>
            <div className={landingPageStyles.logoIcon}>
              <BrickWall className={landingPageStyles.logoIconInner} />
            </div>
            <span className={landingPageStyles.logoText}>Resumania</span>
          </div>
          {/* Mobile Menu BTN */}
          <button
            className={landingPageStyles.mobileMenuButton}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? (
              <X size={24} className={landingPageStyles.mobileMenuIcon} />
            ) : (
              <Menu size={24} className={landingPageStyles.mobileMenuIcon} />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            {user ? (
              <ProfileInfoCard />
            ) : (
              <button
                className={landingPageStyles.desktopAuthButton}
                onClick={() => setOpenAuthModle(true)}
              >
                <div
                  className={landingPageStyles.desktopAuthButtonOverlay}
                ></div>
                <span className={landingPageStyles.desktopAuthButtonText}>
                  Get Started
                </span>
              </button>
            )}
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className={landingPageStyles.mobileMenu}>
              <div className={landingPageStyles.mobileMenuContainer}>
                {user ? (
                  <div className={landingPageStyles.mobileUserInfo}>
                    <div className={landingPageStyles.mobileUserWelcome}>
                      Welcome Back
                    </div>
                    <button className={landingPageStyles.mobileDashboardButton}>
                      Go To Dashboard
                    </button>
                  </div>
                ) : (
                  <button
                    className={landingPageStyles.mobileAuthButton}
                    onClick={() => {
                      setOpenAuthModle(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {" "}
                    Get Started
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className={landingPageStyles.main}>
        <section className={landingPageStyles.heroSection}>
          <div className={landingPageStyles.heroGrid}>
            {/* Left Content */}
            <div className={landingPageStyles.heroLeft}>
              <div className={landingPageStyles.tagline}>
                Pro Resume Builder
              </div>
              <h1 className={landingPageStyles.heading}>
                <span className={landingPageStyles.headingText}>
                  Generate Your
                </span>
                <span className={landingPageStyles.headingGradient}>
                  Professional
                </span>
                <span className={landingPageStyles.headingText}>Resume</span>
              </h1>
              <p className={landingPageStyles.description}>
                Create a Winning Resume with Modern, Expert Templates.
                ATS-ready, recruiter-trusted, and built for career success.
              </p>
              <div className={landingPageStyles.ctaButtons}>
                <button
                  className={landingPageStyles.primaryButton}
                  onClick={handleCTA}
                >
                  <div className={landingPageStyles.primaryButtonOverlay}></div>
                  <span className={landingPageStyles.primaryButtonContent}>
                    Start Building
                    <ArrowRight
                      className={landingPageStyles.primaryButtonIcon}
                      size={18}
                    />
                  </span>
                </button>
                <button
                  className={landingPageStyles.secondaryButton}
                  onClick={handleCTA}
                >
                  View Templates
                </button>
              </div>

              {/* Stats Grid*/}
              <div className={landingPageStyles.statsContainer}>
                {[
                  {
                    value: "5K+",
                    label: "Resumes Created",
                    gradient: "from-violet-600 to-fuchsia-600",
                  },
                  {
                    value: "4.6★",
                    label: "User Rating",
                    gradient: "from-orange-500 to-red-500",
                  },
                  {
                    value: "3 Min",
                    label: "Build Time",
                    gradient: "from-emerald-500 to-teal-500",
                  },
                ].map((state, idx) => (
                  <div className={landingPageStyles.statItem} key={idx}>
                    <div
                      className={`${landingPageStyles.statNumber} ${state.gradient}`}
                    >
                      {state.value}
                    </div>
                    <div className={landingPageStyles.statLabel}>
                      {state.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side */}
            <div className={landingPageStyles.heroIllustration}>
              <div className={landingPageStyles.heroIllustrationBg}></div>
              <div className={landingPageStyles.heroIllustrationContainer}>
                <svg
                  viewBox="0 0 400 500"
                  className={landingPageStyles.svgContainer}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Background */}
                  <defs>
                    <linearGradient
                      id="bgGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#3b82f6" /> {/* Blue */}
                      <stop offset="100%" stopColor="#06b6d4" /> {/* Cyan */}
                    </linearGradient>
                    <linearGradient
                      id="cardGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#e0f7fa" />{" "}
                      {/* Light cyan */}
                      <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                  </defs>

                  {/* SVG elements */}
                  <rect
                    x="50"
                    y="50"
                    width="300"
                    height="400"
                    rx="20"
                    className={landingPageStyles.svgRect}
                    fill="url(#cardGradient)"
                  />
                  <circle
                    cx="120"
                    cy="120"
                    r="25"
                    className={landingPageStyles.svgCircle}
                    fill="#3b82f6"
                  />
                  <rect
                    x="160"
                    y="105"
                    width="120"
                    height="8"
                    rx="4"
                    className={landingPageStyles.svgRectPrimary}
                    fill="#06b6d4"
                  />
                  <rect
                    x="160"
                    y="120"
                    width="80"
                    height="6"
                    rx="3"
                    className={landingPageStyles.svgRectSecondary}
                    fill="#3b82f6"
                  />
                  <rect
                    x="70"
                    y="170"
                    width="260"
                    height="4"
                    rx="2"
                    className={landingPageStyles.svgRectLight}
                    fill="#d0f0fd"
                  />
                  <rect
                    x="70"
                    y="185"
                    width="200"
                    height="4"
                    rx="2"
                    className={landingPageStyles.svgRectLight}
                    fill="#d0f0fd"
                  />
                  <rect
                    x="70"
                    y="200"
                    width="240"
                    height="4"
                    rx="2"
                    className={landingPageStyles.svgRectLight}
                    fill="#d0f0fd"
                  />
                  <rect
                    x="70"
                    y="230"
                    width="60"
                    height="6"
                    rx="3"
                    className={landingPageStyles.svgRectPrimary}
                    fill="#06b6d4"
                  />
                  <rect
                    x="70"
                    y="250"
                    width="40"
                    height="15"
                    rx="7"
                    className={landingPageStyles.svgRectSkill}
                    fill="#3b82f6"
                  />
                  <rect
                    x="120"
                    y="250"
                    width="50"
                    height="15"
                    rx="7"
                    className={landingPageStyles.svgRectSkill}
                    fill="#06b6d4"
                  />
                  <rect
                    x="180"
                    y="250"
                    width="45"
                    height="15"
                    rx="7"
                    className={landingPageStyles.svgRectSkill}
                    fill="#3b82f6"
                  />
                  <rect
                    x="70"
                    y="290"
                    width="80"
                    height="6"
                    rx="3"
                    className={landingPageStyles.svgRectSecondary}
                    fill="#06b6d4"
                  />
                  <rect
                    x="70"
                    y="310"
                    width="180"
                    height="4"
                    rx="2"
                    className={landingPageStyles.svgRectLight}
                    fill="#d0f0fd"
                  />
                  <rect
                    x="70"
                    y="325"
                    width="150"
                    height="4"
                    rx="2"
                    className={landingPageStyles.svgRectLight}
                    fill="#d0f0fd"
                  />
                  <rect
                    x="70"
                    y="340"
                    width="200"
                    height="4"
                    rx="2"
                    className={landingPageStyles.svgRectLight}
                    fill="#d0f0fd"
                  />

                  {/* Animated elements */}
                  <circle
                    cx="320"
                    cy="100"
                    r="15"
                    className={landingPageStyles.svgAnimatedCircle}
                    fill="#06b6d4"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0,0; 0,-10; 0,0"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <rect
                    x="30"
                    y="300"
                    width="12"
                    height="12"
                    rx="6"
                    className={landingPageStyles.svgAnimatedRect}
                    fill="#3b82f6"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0,0; 5,0; 0,0"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </rect>
                  <polygon
                    points="360,200 370,220 350,220"
                    className={landingPageStyles.svgAnimatedPolygon}
                    fill="#06b6d4"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      values="0 360 210; 360 360 210; 0 360 210"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </polygon>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className={landingPageStyles.featuresSection}>
          <div className={landingPageStyles.featuresContainer}>
            <div className={landingPageStyles.featuresHeader}>
              <h2 className={landingPageStyles.featuresTitle}>
                Why{" "}
                <span className={landingPageStyles.featuresTitleGradient}>
                  Resumania
                </span>{" "}
                Is Your Best Choice
              </h2>
              <p className={landingPageStyles.featuresDescription}>
                Get noticed faster with powerful, sleek, and modern resume
                templates.
              </p>
            </div>
            <div className={landingPageStyles.featuresGrid}>
              {[
                {
                  icon: <Zap className={landingPageStyles.featureIcon} />,
                  title: "Lightning Fast",
                  description:
                    "Create professional resumes in under 5 minutes with our streamlined process",
                  gradient: landingPageStyles.featureIconYellow,
                  bg: landingPageStyles.featureCardViolet,
                },
                {
                  icon: (
                    <LayoutTemplate className={landingPageStyles.featureIcon} />
                  ),
                  title: "Pro Templates",
                  description:
                    "Choose from dozens of recruiter-approved, industry-specific templates",
                  gradient: landingPageStyles.featureIconPurpul,
                  bg: landingPageStyles.featureCardFuchsia,
                },
                {
                  icon: <Download className={landingPageStyles.featureIcon} />,
                  title: "Instant Export",
                  description:
                    "Download high-quality PDFs instantly with perfect formatting",
                  gradient: landingPageStyles.featureIconGreen,
                  bg: landingPageStyles.featureCardOrange,
                },
              ].map((feature, index) => (
                <div key={index} className={landingPageStyles.featureCard}>
                  <div className={landingPageStyles.featureCardHover}></div>
                  <div
                    className={`${landingPageStyles.featureCardContent} ${feature.bg}`}
                  >
                    <div
                      className={`${landingPageStyles.featureIconContainer} ${feature.gradient}`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className={landingPageStyles.featureTitle}>
                      {feature.title}
                    </h3>
                    <p className={landingPageStyles.featureDescription}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className={landingPageStyles.ctaSection}>
          <div className={landingPageStyles.ctaContainer}>
            <div className={landingPageStyles.ctaCard}>
              <div className={landingPageStyles.ctaCardBg}></div>
              <div className={landingPageStyles.ctaCardContent}>
                <h2 className={landingPageStyles.ctaTitle}>
                  Ready To Build Your{" "}
                  <span className={landingPageStyles.ctaTitleGradient}>
                    Standout Resume?
                  </span>
                </h2>
                <p className={landingPageStyles.ctaDescription}>
                  Join Thousands of Proffesinals who Landed Their Dream Jobs
                  with Our Platform
                </p>
                <button
                  className={landingPageStyles.ctaButton}
                  onClick={handleCTA}
                >
                  <div className={landingPageStyles.ctaButtonOverlay}></div>
                  <span className={landingPageStyles.ctaButtonText}>
                    Start Building Now
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className={landingPageStyles.footer}>
        <div className={landingPageStyles.footerContainer}>
          <p className={landingPageStyles.footerText}>
            Crafted With{" "}
            <span className={landingPageStyles.footerHeart}>❣️</span> by{" "}
            <a
              href="https://github.com/LokendraNath"
              target="_blank"
              className={landingPageStyles.footerLink}
            >
              Lokendra Nath
            </a>
          </p>
        </div>
      </footer>

      {/* Modal For Login And Signup */}
      <Modal
        isOpen={openAuthModle}
        onClose={() => {
          setOpenAuthModle(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </div>
  );
};
export default LandingPage;
