import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPipelines, setActivePipeline, setLoading, setError } from "@/store/slices/pipelineSlice";
import { pipelineService } from "@/services/api/pipelineService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import StatCard from "@/components/molecules/StatCard";
import PipelineBoard from "@/components/organisms/PipelineBoard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "react-toastify";

const Pipeline = () => {
  const dispatch = useDispatch();
  const { pipelines, leads, activePipeline, loading, error } = useSelector((state) => state.pipeline);
  const { t } = useLanguage();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const [pipelinesData, leadsData] = await Promise.all([
        pipelineService.getPipelines(),
        pipelineService.getLeads()
      ]);
      dispatch(setPipelines(pipelinesData));
      if (pipelinesData.length > 0 && !activePipeline) {
        dispatch(setActivePipeline(pipelinesData[0].Id));
      }
    } catch (error) {
      dispatch(setError(error.message));
      toast.error(t("error"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handlePipelineChange = (pipelineId) => {
    dispatch(setActivePipeline(parseInt(pipelineId)));
  };

  const getTotalValue = () => {
    return leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
  };

  const getConversionRate = () => {
    const totalLeads = leads.length;
    const wonLeads = leads.filter(lead => lead.stage === "closedWon").length;
    return totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : 0;
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  if (pipelines.length === 0) {
    return (
      <Empty
        icon="BarChart3"
        title="No pipelines created yet"
        description="Create your first sales pipeline to start tracking leads and opportunities"
        actionLabel="Create Pipeline"
        onAction={() => toast.info("Pipeline creation coming soon!")}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t("pipeline")}</h1>
          <p className="text-gray-400 mt-1">
            Track and manage your sales opportunities
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={activePipeline || ""}
            onChange={(e) => handlePipelineChange(e.target.value)}
            className="w-48"
          >
            <option value="">Select Pipeline</option>
            {pipelines.map((pipeline) => (
              <option key={pipeline.Id} value={pipeline.Id}>
                {pipeline.name}
              </option>
            ))}
          </Select>
          <Button>
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            {t("addLead")}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t("totalValue")}
          value={`$${getTotalValue().toLocaleString()}`}
          icon="DollarSign"
          trend="up"
          trendValue="+12.5%"
        />
        <StatCard
          title={t("leads")}
          value={leads.length}
          icon="Users"
          trend="up"
          trendValue="+8"
        />
        <StatCard
          title={t("conversionRate")}
          value={`${getConversionRate()}%`}
          icon="TrendingUp"
          trend="up"
          trendValue="+2.3%"
        />
        <StatCard
          title="Avg. Deal Size"
          value={`$${leads.length > 0 ? Math.round(getTotalValue() / leads.length).toLocaleString() : 0}`}
          icon="Target"
          trend="up"
          trendValue="+5.2%"
        />
      </div>

      {/* Pipeline Board */}
      <div className="bg-transparent rounded-xl border border-white/10 p-6">
        <PipelineBoard />
      </div>
    </div>
  );
};

export default Pipeline;