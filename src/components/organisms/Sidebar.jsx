import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "@/store/slices/uiSlice";
import ApperIcon from "@/components/ApperIcon";
import { useLanguage } from "@/hooks/useLanguage";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const { t } = useLanguage();

  const navigation = [
    { name: t("pipeline"), href: "/pipeline", icon: "BarChart3" },
    { name: t("contacts"), href: "/contacts", icon: "Users" },
    { name: t("inbox"), href: "/inbox", icon: "Mail" },
    { name: t("documents"), href: "/documents", icon: "FileText" },
    { name: t("billing"), href: "/billing", icon: "CreditCard" },
    { name: t("reports"), href: "/reports", icon: "PieChart" },
    { name: t("settings"), href: "/settings", icon: "Settings" },
  ];

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:block w-64 glass-dark border-r border-white/10 h-full">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-secondary">
            <ApperIcon name="Zap" className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold gradient-text">FlowCRM</h1>
        </div>
        
        <nav className="space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <ApperIcon name={item.icon} className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}
      
      <div className={`fixed inset-y-0 left-0 z-50 w-64 glass-dark border-r border-white/10 transform transition-transform duration-300 lg:hidden ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-secondary">
                <ApperIcon name="Zap" className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold gradient-text">FlowCRM</h1>
            </div>
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ApperIcon name="X" className="h-5 w-5 text-gray-400" />
            </button>
          </div>
          
          <nav className="space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => dispatch(toggleSidebar())}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/20"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                <ApperIcon name={item.icon} className="h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;