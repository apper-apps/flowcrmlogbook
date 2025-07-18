import { useDispatch } from "react-redux";
import { toggleSidebar } from "@/store/slices/uiSlice";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import LanguageToggle from "@/components/molecules/LanguageToggle";
import SearchBar from "@/components/molecules/SearchBar";

const Header = () => {
  const dispatch = useDispatch();

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
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <ApperIcon name="User" className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium text-white hidden sm:block">
              Sales Team
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;