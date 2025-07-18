import { useDispatch, useSelector } from "react-redux";
import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toggleSidebar } from "@/store/slices/uiSlice";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import LanguageToggle from "@/components/molecules/LanguageToggle";
import SearchBar from "@/components/molecules/SearchBar";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
  };

  const handleSignIn = () => {
    navigate('/login');
    setIsDropdownOpen(false);
  };

  const handleSignUp = () => {
    navigate('/signup');
    setIsDropdownOpen(false);
  };
  return (
    <header className="glass-dark border-b border-white/10 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(toggleSidebar())}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </Button>
          
          <div className="hidden md:block">
            <SearchBar 
              placeholder="Search leads, contacts, documents..."
              className="w-80"
              onSearch={(term) => console.log("Search:", term)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <ApperIcon name="Bell" className="h-5 w-5" />
          </Button>
          
          <LanguageToggle />
          
<div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 hover:bg-white/10 rounded-lg p-2 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <ApperIcon name="User" className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-white hidden sm:block">
                {isAuthenticated ? (user?.firstName || user?.name || 'User') : 'Guest'}
              </span>
              <ApperIcon 
                name="ChevronDown" 
                className={`h-4 w-4 text-white/70 transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 glass-dark border border-white/10 rounded-lg shadow-xl z-50">
                <div className="py-2">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-sm font-medium text-white">
                          {user?.firstName || user?.name || 'User'}
                        </p>
                        <p className="text-xs text-white/70">
                          {user?.emailAddress || user?.email || 'user@example.com'}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                      >
                        <ApperIcon name="LogOut" className="h-4 w-4" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleSignIn}
                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                      >
                        <ApperIcon name="LogIn" className="h-4 w-4" />
                        Sign In
                      </button>
                      <button
                        onClick={handleSignUp}
                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                      >
                        <ApperIcon name="UserPlus" className="h-4 w-4" />
                        Sign Up
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;