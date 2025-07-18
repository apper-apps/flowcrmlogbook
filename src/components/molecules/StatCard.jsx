import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ title, value, icon, trend, trendValue, className }) => {
  const isPositive = trend === "up";
  
  return (
    <Card className={cn("hover:scale-[1.02] transition-all duration-200", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 ${isPositive ? "text-success" : "text-error"}`}>
              <ApperIcon 
                name={isPositive ? "TrendingUp" : "TrendingDown"} 
                className="h-4 w-4"
              />
              <span className="text-sm font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20">
          <ApperIcon name={icon} className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;