import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import PipelineBoard from "@/components/organisms/PipelineBoard";
import Pipeline from "@/components/pages/Pipeline";
import StatCard from "@/components/molecules/StatCard";
import ListView from "@/components/molecules/ListView";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import CreateDocumentModal from "@/components/organisms/CreateDocumentModal";
import { useLanguage } from "@/hooks/useLanguage";
import { documentsService } from "@/services/api/documentsService";
import { setSectionFilters } from "@/store/slices/uiSlice";
import { setDocuments, setError, setLoading } from "@/store/slices/documentsSlice";
const Documents = () => {
  const dispatch = useDispatch();
  const { documents, loading, error } = useSelector((state) => state.documents);
  const { sectionFilters } = useSelector((state) => state.ui.listView);
  const { t } = useLanguage();
  const [showPipelineView, setShowPipelineView] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  const filters = [
    { label: "All Documents", value: "all" },
    { label: "Proposals", value: "proposal" },
    { label: "Contracts", value: "contract" },
    { label: "Invoices", value: "invoice" },
    { label: "Draft", value: "draft" },
    { label: "Sent", value: "sent" },
    { label: "Viewed", value: "viewed" },
    { label: "Signed", value: "signed" },
    { label: "Expired", value: "expired" }
  ];

  const handleFilterChange = (filters) => {
    dispatch(setSectionFilters({ section: "documents", filters }));
  };

  const renderDocumentItem = (document, { rowSize }) => (
    <Card className="hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20">
            <ApperIcon name={getDocumentIcon(document.type)} className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{document.title}</h3>
            <p className="text-sm text-gray-400 capitalize">{document.type}</p>
            {rowSize !== "small" && (
              <div className="flex items-center gap-2 mt-1">
                <ApperIcon name="User" className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-400">{document.contactName}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
<Badge variant={getStatusColor(document.status)} size="sm">
              {document.status}
            </Badge>
            {rowSize !== "small" && (
              <p className="text-xs text-gray-400 mt-1">
                {document.createdAt && !isNaN(new Date(document.createdAt)) 
                  ? format(new Date(document.createdAt), "MMM dd, yyyy")
                  : "Date not available"}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm">
              <ApperIcon name="Eye" className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ApperIcon name="Edit" className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ApperIcon name="Send" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

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
        onAction={() => setShowCreateModal(true)}
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
          <Button 
            variant={showPipelineView ? "primary" : "outline"}
            onClick={() => setShowPipelineView(!showPipelineView)}
          >
            <ApperIcon name="BarChart3" className="h-4 w-4 mr-2" />
            Pipeline View
          </Button>
          <Button variant="outline">
            <ApperIcon name="Upload" className="h-4 w-4 mr-2" />
            Import
</Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Create Document
          </Button>
        </div>
      </div>

      {showPipelineView ? (
        <PipelineBoard />
      ) : (
        <>
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

          {/* Documents List */}
          <ListView
            items={documents}
            renderItem={renderDocumentItem}
            filters={filters}
            section="documents"
            onFilterChange={handleFilterChange}
            selectedFilters={sectionFilters.documents}
            emptyState={
              <Empty
                icon="FileText"
title="No documents yet"
                description="Create your first document to start building professional proposals and contracts"
                actionLabel="Create Document"
                onAction={() => setShowCreateModal(true)}
              />
            }
          />
</>
      )}
      
      <CreateDocumentModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </div>
  );
};

export default Documents;