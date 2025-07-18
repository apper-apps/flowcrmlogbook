import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  icon = "Database", 
  title = "No data available", 
  description = "Get started by adding your first item", 
  actionLabel = "Get Started",
  onAction 
}) => {
  return (
    <Card className="p-12 text-center">
      <div className="w-20 h-20 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <ApperIcon name={icon} className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-2xl font-semibold text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        {description}
      </p>
      <Button onClick={onAction} size="lg" className="bg-gradient-to-r from-primary to-secondary">
        <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
        {actionLabel}
      </Button>
    </Card>
  );
};

export default Empty;