import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { useLanguage } from "@/hooks/useLanguage";

const FilterDropdown = ({ filters, onFilterChange, selectedFilters = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const handleFilterToggle = (filter) => {
    const newFilters = selectedFilters.includes(filter)
      ? selectedFilters.filter(f => f !== filter)
      : [...selectedFilters, filter];
    onFilterChange(newFilters);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <ApperIcon name="Filter" className="h-4 w-4" />
        {t("filter")}
        {selectedFilters.length > 0 && (
          <span className="bg-primary text-white rounded-full px-2 py-0.5 text-xs">
            {selectedFilters.length}
          </span>
        )}
      </Button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 glass-dark rounded-lg border border-white/10 shadow-xl z-50">
          <div className="p-4 space-y-2">
            {filters.map((filter) => (
              <label key={filter.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFilters.includes(filter.value)}
                  onChange={() => handleFilterToggle(filter.value)}
                  className="rounded border-white/20 bg-transparent text-primary focus:ring-primary/50"
                />
                <span className="text-sm text-white">{filter.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;