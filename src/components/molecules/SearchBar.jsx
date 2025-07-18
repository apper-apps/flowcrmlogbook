import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import { useLanguage } from "@/hooks/useLanguage";

const SearchBar = ({ onSearch, placeholder, className }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useLanguage();

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className={`relative ${className}`}>
      <ApperIcon 
        name="Search" 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
      />
      <Input
        type="text"
        placeholder={placeholder || t("search")}
        value={searchTerm}
        onChange={handleSearch}
        className="pl-10"
      />
    </div>
  );
};

export default SearchBar;