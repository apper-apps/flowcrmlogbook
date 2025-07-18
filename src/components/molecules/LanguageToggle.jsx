import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "@/store/slices/uiSlice";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const LanguageToggle = () => {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.ui.language);

  const toggleLanguage = () => {
    dispatch(setLanguage(language === "en" ? "es" : "en"));
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2"
    >
      <ApperIcon name="Globe" className="h-4 w-4" />
      <span className="text-sm font-medium">
        {language === "en" ? "ES" : "EN"}
      </span>
    </Button>
  );
};

export default LanguageToggle;