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
import CreateInvoiceModal from "@/components/organisms/CreateInvoiceModal";
import useLanguage from "@/hooks/useLanguage";
import { billingService } from "@/services/api/billingService";
import { setSectionFilters } from "@/store/slices/uiSlice";
import { setError, setInvoices, setLoading } from "@/store/slices/billingSlice";
const Billing = () => {
  const dispatch = useDispatch();
  const { invoices, loading, error } = useSelector((state) => state.billing);
  const { sectionFilters } = useSelector((state) => state.ui.listView);
  const { t } = useLanguage();
  const [showPipelineView, setShowPipelineView] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const data = await billingService.getAll();
      dispatch(setInvoices(data));
    } catch (error) {
      dispatch(setError(error.message));
      toast.error(t("error"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getTotalRevenue = () => {
    return invoices
      .filter(invoice => invoice.status === "paid")
      .reduce((sum, invoice) => sum + invoice.total, 0);
  };

  const getPendingAmount = () => {
    return invoices
      .filter(invoice => invoice.status === "pending")
      .reduce((sum, invoice) => sum + invoice.total, 0);
  };

  const getOverdueAmount = () => {
    return invoices
      .filter(invoice => invoice.status === "overdue")
      .reduce((sum, invoice) => sum + invoice.total, 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "overdue":
        return "error";
      case "draft":
        return "default";
      default:
        return "default";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
};

  const filters = [
    { label: "All Invoices", value: "all" },
    { label: "Paid", value: "paid" },
    { label: "Pending", value: "pending" },
    { label: "Overdue", value: "overdue" },
    { label: "Draft", value: "draft" }
  ];

  const handleFilterChange = (filters) => {
    dispatch(setSectionFilters({ section: "billing", filters }));
  };

// Helper function to safely format dates
  const formatDate = (dateValue, formatString = "MMM dd, yyyy") => {
    if (!dateValue) return "N/A";
    
    try {
      const date = new Date(dateValue);
      // Check if date is valid
      if (isNaN(date.getTime())) return "N/A";
      return format(date, formatString);
    } catch (error) {
      return "N/A";
    }
  };

  const renderInvoiceItem = (invoice, { rowSize }) => (
    <Card className="hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20">
            <ApperIcon name="FileText" className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-white">
              Invoice #{invoice.number}
            </h3>
            <p className="text-sm text-gray-400">{invoice.contactName}</p>
            {rowSize !== "small" && (
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <ApperIcon name="Calendar" className="h-3 w-3" />
                  Created: {formatDate(invoice.createdAt)}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <ApperIcon name="Clock" className="h-3 w-3" />
                  Due: {formatDate(invoice.dueDate)}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xl font-bold text-white">
              {formatCurrency(invoice.total)}
            </p>
            <Badge variant={getStatusColor(invoice.status)} size="sm">
              {invoice.status}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <ApperIcon name="Eye" className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ApperIcon name="Edit" className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ApperIcon name="Download" className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ApperIcon name="Send" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Invoice Items Summary */}
      {rowSize !== "small" && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-gray-400">
                {invoice.items.length} item{invoice.items.length !== 1 ? "s" : ""}
              </span>
              {invoice.status === "paid" && invoice.paidAt && (
                <div className="flex items-center gap-1 text-success">
                  <ApperIcon name="Check" className="h-3 w-3" />
                  Paid on {formatDate(invoice.paidAt)}
                </div>
              )}
            </div>
            
            {invoice.status === "pending" && (
              <Button size="sm" variant="primary">
                <ApperIcon name="Send" className="h-4 w-4 mr-2" />
                Send Reminder
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadInvoices} />;
  }

  if (invoices.length === 0) {
    return (
      <Empty
        icon="CreditCard"
title="No invoices yet"
        description="Create your first invoice to start tracking payments and revenue"
        actionLabel="Create Invoice"
        onAction={() => setShowCreateModal(true)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t("billing")}</h1>
          <p className="text-gray-400 mt-1">
            Manage invoices and track your revenue
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
            <ApperIcon name="Download" className="h-4 w-4 mr-2" />
            Export
</Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Create Invoice
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
              title="Total Revenue"
              value={formatCurrency(getTotalRevenue())}
              icon="DollarSign"
              trend="up"
              trendValue="+12.5%"
            />
            <StatCard
              title="Pending Payments"
              value={formatCurrency(getPendingAmount())}
              icon="Clock"
              trend="up"
              trendValue="+8.3%"
            />
            <StatCard
              title="Overdue Amount"
              value={formatCurrency(getOverdueAmount())}
              icon="AlertCircle"
              trend="down"
              trendValue="-2.1%"
            />
            <StatCard
              title="Total Invoices"
              value={invoices.length}
              icon="FileText"
              trend="up"
              trendValue="+5"
            />
          </div>

          {/* Invoices List */}
          <ListView
            items={invoices}
            renderItem={renderInvoiceItem}
            filters={filters}
            section="billing"
            onFilterChange={handleFilterChange}
            selectedFilters={sectionFilters.billing}
            emptyState={
              <Empty
                icon="CreditCard"
title="No invoices yet"
                description="Create your first invoice to start tracking payments and revenue"
                actionLabel="Create Invoice"
                onAction={() => setShowCreateModal(true)}
              />
            }
          />
</>
      )}
      
      <CreateInvoiceModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </div>
  );
};

export default Billing;