import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";

const Error = ({ message, onRetry }) => {
  return (
    <Card className="p-8 text-center">
      <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <ApperIcon name="AlertCircle" className="h-8 w-8 text-error" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        {message || "We encountered an error while loading your data. Please try again."}
      </p>
      <div className="flex items-center justify-center gap-4">
        <Button onClick={onRetry} variant="primary">
          <ApperIcon name="RotateCcw" className="h-4 w-4 mr-2" />
          Try Again
        </Button>
        <Button variant="outline">
          <ApperIcon name="MessageCircle" className="h-4 w-4 mr-2" />
          Report Issue
        </Button>
      </div>
    </Card>
  );
};

export default Error;