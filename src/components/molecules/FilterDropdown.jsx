import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { useLanguage } from "@/hooks/useLanguage";
import { setGroupBy } from "@/store/slices/contactsSlice";

const FilterDropdown = ({ filters, onFilterChange, selectedFilters = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const { groupBy } = useSelector((state) => state.contacts);

  const handleFilterToggle = (filter) => {
    const newFilters = selectedFilters.includes(filter)
      ? selectedFilters.filter(f => f !== filter)
      : [...selectedFilters, filter];
    onFilterChange(newFilters);
};

  const groupOptions = [
    { value: null, label: "No Grouping" },
    { value: "status", label: "Status" },
    { value: "company", label: "Company" },
    { value: "source", label: "Source" },
    { value: "position", label: "Position" }
  ];

  const handleGroupChange = (groupValue) => {
    dispatch(setGroupBy(groupValue));
    setIsGroupOpen(false);
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
      
      <Button
        variant="info"
        onClick={() => setIsGroupOpen(!isGroupOpen)}
        className="flex items-center gap-2"
      >
        <ApperIcon name="Group" className="h-4 w-4" />
        Group
        {groupBy && (
          <span className="bg-info text-white rounded-full px-2 py-0.5 text-xs">
            {groupOptions.find(opt => opt.value === groupBy)?.label}
          </span>
        )}
      </Button>
{isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 glass-dark rounded-lg border border-white/10 shadow-xl z-50">
          <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
            {filters.map((filter) => (
              <label key={filter.value} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-2 rounded transition-colors">
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
          
          {selectedFilters.length > 0 && (
            <div className="p-3 border-t border-white/10">
              <button
                onClick={() => onFilterChange([])}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
</div>
      )}
      
      {isGroupOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 glass-dark rounded-lg border border-white/10 shadow-xl z-50">
          <div className="p-4 space-y-2">
            {groupOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleGroupChange(option.value)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  groupBy === option.value
                    ? 'bg-info text-white'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;