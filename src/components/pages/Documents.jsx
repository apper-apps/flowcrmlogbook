import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDocuments, setLoading, setError } from "@/store/slices/documentsSlice";
import { documentsService } from "@/services/api/documentsService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "react-toastify";
import { format } from "date-fns";

const Documents = () => {
  const dispatch = useDispatch();
  const { documents, loading, error } = useSelector((state) => state.documents);
  const { t } = useLanguage();

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const data = await documentsService.getAll();
      dispatch(setDocuments(data));
    } catch (error) {
      dispatch(setError(error.message));
      toast.error(t("error"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getDocumentsByStatus = (status) => {
    return documents.filter(doc => doc.status === status).length;
  };

  const getDocumentIcon = (type) => {
    switch (type) {
      case "proposal":
        return "FileText";
      case "contract":
        return "FileCheck";
      case "invoice":
        return "Receipt";
      default:
        return "File";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "draft":
        return "warning";
      case "sent":
        return "info";
      case "viewed":
        return "primary";
      case "signed":
        return "success";
      case "expired":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDocuments} />;
  }

  if (documents.length === 0) {
    return (
      <Empty
        icon="FileText"
        title="No documents yet"
        description="Create your first document to start building professional proposals and contracts"
        actionLabel="Create Document"
        onAction={() => toast.info("Document creation coming soon!")}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t("documents")}</h1>
          <p className="text-gray-400 mt-1">
            Create, manage, and track your business documents
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline">
            <ApperIcon name="Upload" className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button>
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Create Document
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Documents"
          value={documents.length}
          icon="FileText"
          trend="up"
          trendValue="+12"
        />
        <StatCard
          title="Sent Documents"
          value={getDocumentsByStatus("sent")}
          icon="Send"
          trend="up"
          trendValue="+5"
        />
        <StatCard
          title="Signed Documents"
          value={getDocumentsByStatus("signed")}
          icon="FileCheck"
          trend="up"
          trendValue="+3"
        />
        <StatCard
          title="Completion Rate"
          value={`${documents.length > 0 ? ((getDocumentsByStatus("signed") / documents.length) * 100).toFixed(1) : 0}%`}
          icon="TrendingUp"
          trend="up"
          trendValue="+2.5%"
        />
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((document) => (
          <Card key={document.Id} className="p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20">
                  <ApperIcon name={getDocumentIcon(document.type)} className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{document.title}</h3>
                  <p className="text-sm text-gray-400 capitalize">{document.type}</p>
                </div>
              </div>
              <Badge variant={getStatusColor(document.status)} size="sm">
                {document.status}
              </Badge>
            </div>

            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <ApperIcon name="User" className="h-3 w-3" />
                <span>{document.contactName}</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Calendar" className="h-3 w-3" />
                <span>{format(new Date(document.createdAt), "MMM dd, yyyy")}</span>
              </div>
              {document.sentAt && (
                <div className="flex items-center gap-2">
                  <ApperIcon name="Send" className="h-3 w-3" />
                  <span>Sent {format(new Date(document.sentAt), "MMM dd")}</span>
                </div>
              )}
              {document.viewedAt && (
                <div className="flex items-center gap-2">
                  <ApperIcon name="Eye" className="h-3 w-3" />
                  <span>Viewed {format(new Date(document.viewedAt), "MMM dd")}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
              <Button variant="ghost" size="sm">
                <ApperIcon name="Eye" className="h-4 w-4 mr-2" />
                View
              </Button>
              <Button variant="ghost" size="sm">
                <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="ghost" size="sm">
                <ApperIcon name="Send" className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Documents;