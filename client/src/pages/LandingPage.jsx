import { BrickWall, Menu, X } from "lucide-react";

import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={landingPageStyles.container}>
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
          <div className="hidden md:flex items-center">{user}</div>
        </div>
      </header>
    </div>
  );
};
export default LandingPage;
