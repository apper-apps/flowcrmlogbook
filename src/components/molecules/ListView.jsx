import { useSelector, useDispatch } from "react-redux";
import { setRowSize } from "@/store/slices/uiSlice";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import { cn } from "@/utils/cn";

const ListView = ({ 
  items, 
  renderItem, 
  filters = [], 
  section,
  onFilterChange,
  selectedFilters = [],
  className,
  emptyState,
  showRowSizeControls = true,
  showFilters = true
}) => {
  const dispatch = useDispatch();
  const { rowSize } = useSelector((state) => state.ui.listView);

  const handleRowSizeChange = (size) => {
    dispatch(setRowSize(size));
  };

  const getRowSizeClasses = () => {
    switch (rowSize) {
      case "large":
        return "gap-6";
      case "medium":
        return "gap-4";
      case "small":
        return "gap-2";
      default:
        return "gap-4";
    }
  };

  const getItemSizeClasses = () => {
    switch (rowSize) {
      case "large":
        return "p-6";
      case "medium":
        return "p-4";
      case "small":
        return "p-3";
      default:
        return "p-4";
    }
  };

  if (items.length === 0) {
    return emptyState;
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Controls */}
      {(showRowSizeControls || showFilters) && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showRowSizeControls && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Row size:</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant={rowSize === "small" ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => handleRowSizeChange("small")}
                  >
                    <ApperIcon name="Minus" className="h-3 w-3" />
                  </Button>
                  <Button
                    variant={rowSize === "medium" ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => handleRowSizeChange("medium")}
                  >
                    <ApperIcon name="Square" className="h-3 w-3" />
                  </Button>
                  <Button
                    variant={rowSize === "large" ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => handleRowSizeChange("large")}
                  >
                    <ApperIcon name="Plus" className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {showFilters && filters.length > 0 && (
              <FilterDropdown
                filters={filters}
                selectedFilters={selectedFilters}
                onFilterChange={onFilterChange}
              />
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">{items.length} items</span>
            </div>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className={cn("space-y-1", getRowSizeClasses())}>
        {items.map((item, index) => (
          <div key={item.Id || index} className={getItemSizeClasses()}>
            {renderItem(item, { rowSize, itemSizeClasses: getItemSizeClasses() })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListView;