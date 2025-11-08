import { useRef, useState } from "react";
import { DUMMY_RESUME_DATA, resumeTemplates } from "../utils/data";
import Tabs from "./Tabs";
import { Check } from "lucide-react";
import { TemplateCard } from "./Card";
import RenderResume from "./RenderResume";

const ThemeSelector = ({ selectedTheme, setSelectedTheme }) => {
  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(800);

  // Selected Theme Template Using ID
  const initialIndex = resumeTemplates.findIndex((t) => t.id === selectedTheme);
  const [selectedTemplate, setselectedTemplate] = useState({
    theme: selectedTemplate || resumeTemplates[0]?.id || "",
    index: initialIndex >= 0 ? initialIndex : 0,
  });

  const [tabValue, setTabValue] = useState("Templates");

  const handleThemeSelector = () => {
    setselectedTemplate(selectedTemplate.theme);
    onclose();
  };

  const updateBaseWidth = () => {
    if (resumeRef.current) {
      setBaseWidth(resumeRef.current.offsetWidth);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 p-4 sm:p-6 bg-gradient-to-r from-white to-blue-50 rounded-2xl border border-blue-100">
        <Tabs
          tabs={TAB_DATA}
          activeTab={tabValue}
          setActiveTab={setActiveTab}
        />

        <button
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black rounded-2xl hover:scale-105 translate-all shadow-lg hover:shadow-xl"
          onClick={handleThemeSelector}
        >
          <Check size={18} /> Apply Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] lg:max-h-[70vh] overflow-auto p-2">
            {resumeTemplates.map((template, index) => {
              <TemplateCard
                key={`template_${index}`}
                thumbnailImg={template.thumbnailImg}
                isSelected={selectedTemplate.index === index}
                onSelect={() =>
                  setselectedTemplate({
                    theme: template.id,
                    index,
                  })
                }
              />;
            })}
          </div>
        </div>
        {/* Right Area */}
        <div
          className="lg:col-span-3 bg-white rounded-2xl border border-gray-100  p-4 sm:p-6"
          ref={resumeRef}
        >
          <RenderResume
            templateId={selectedTemplate?.theme || ""}
            resumeData={resumeData || DUMMY_RESUME_DATA}
            containerWidth={baseWidth}
          />
        </div>
      </div>
    </div>
  );
};
