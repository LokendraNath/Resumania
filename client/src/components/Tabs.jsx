const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="w-full my-2">
      <div className="flex flex-wrap bg-blue-50 p-1 rounded-2xl border border-blue-100">
        {tabs.map((tab) => (
          <button
            key={tab.lable}
            className={`relative flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              activeTab === tab.lable
                ? "bg-white text-blue-700 shadow-lg"
                : "text-slate-500 hover:text-blue-600 hover:bg-white/50"
            }`}
            onClick={() => setActiveTab(tab.lable)}
          >
            <span className="relative z-10">
              {tab.lable}
              {activeTab === tab.lable && (
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500 rounded-xl">
                  
                </div>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
export default Tabs;
