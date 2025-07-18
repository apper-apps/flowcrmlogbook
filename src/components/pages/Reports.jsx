import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import StatCard from "@/components/molecules/StatCard";
import { useLanguage } from "@/hooks/useLanguage";
import Chart from "react-apexcharts";

const Reports = () => {
  const { leads } = useSelector((state) => state.pipeline);
  const { contacts } = useSelector((state) => state.contacts);
  const { invoices } = useSelector((state) => state.billing);
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState("30");

  // Pipeline Conversion Chart
  const pipelineData = {
    series: [
      {
        name: "Leads",
        data: [45, 38, 32, 28, 22, 18, 15],
      },
    ],
    options: {
      chart: {
        type: "bar",
        toolbar: { show: false },
        background: "transparent",
      },
      theme: {
        mode: "dark",
      },
      colors: ["#6366F1"],
      xaxis: {
        categories: ["Cold", "Engaged", "Contact", "Qualified", "Proposal", "Negotiation", "Closed"],
        labels: {
          style: {
            colors: "#9CA3AF",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#9CA3AF",
          },
        },
      },
      grid: {
        borderColor: "#374151",
        strokeDashArray: 3,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: false,
        },
      },
    },
  };

  // Revenue Chart
  const revenueData = {
    series: [
      {
        name: "Revenue",
        data: [12000, 15000, 18000, 22000, 25000, 28000],
      },
    ],
    options: {
      chart: {
        type: "line",
        toolbar: { show: false },
        background: "transparent",
      },
      theme: {
        mode: "dark",
      },
      colors: ["#EC4899"],
      stroke: {
        curve: "smooth",
        width: 3,
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        labels: {
          style: {
            colors: "#9CA3AF",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#9CA3AF",
          },
          formatter: (value) => `$${value.toLocaleString()}`,
        },
      },
      grid: {
        borderColor: "#374151",
        strokeDashArray: 3,
      },
      markers: {
        size: 6,
        colors: ["#EC4899"],
      },
    },
  };

  // Activity Chart
  const activityData = {
    series: [32, 28, 22, 18],
    options: {
      chart: {
        type: "donut",
        background: "transparent",
      },
      theme: {
        mode: "dark",
      },
      colors: ["#10B981", "#F59E0B", "#EF4444", "#6366F1"],
      labels: ["Emails", "Calls", "Meetings", "Documents"],
      legend: {
        labels: {
          colors: "#9CA3AF",
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: "70%",
          },
        },
      },
    },
  };

  const calculateMetrics = () => {
    const totalLeads = leads.length;
    const wonLeads = leads.filter(lead => lead.stage === "closedWon").length;
    const totalRevenue = invoices
      .filter(invoice => invoice.status === "paid")
      .reduce((sum, invoice) => sum + invoice.total, 0);
    const avgDealSize = totalLeads > 0 ? totalRevenue / wonLeads : 0;
    const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;

    return {
      totalLeads,
      wonLeads,
      totalRevenue,
      avgDealSize,
      conversionRate,
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t("reports")}</h1>
          <p className="text-gray-400 mt-1">
            Analyze your sales performance and track key metrics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </Select>
          <Button variant="outline">
            <ApperIcon name="Download" className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          icon="DollarSign"
          trend="up"
          trendValue="+12.5%"
        />
        <StatCard
          title="Conversion Rate"
          value={`${metrics.conversionRate.toFixed(1)}%`}
          icon="TrendingUp"
          trend="up"
          trendValue="+2.3%"
        />
        <StatCard
          title="Avg Deal Size"
          value={`$${metrics.avgDealSize.toLocaleString()}`}
          icon="Target"
          trend="up"
          trendValue="+8.2%"
        />
        <StatCard
          title="Total Leads"
          value={metrics.totalLeads}
          icon="Users"
          trend="up"
          trendValue="+15"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Conversion */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Pipeline Conversion</h3>
            <ApperIcon name="BarChart3" className="h-5 w-5 text-primary" />
          </div>
          <Chart
            options={pipelineData.options}
            series={pipelineData.series}
            type="bar"
            height={300}
          />
        </Card>

        {/* Revenue Trend */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Revenue Trend</h3>
            <ApperIcon name="TrendingUp" className="h-5 w-5 text-accent" />
          </div>
          <Chart
            options={revenueData.options}
            series={revenueData.series}
            type="line"
            height={300}
          />
        </Card>

        {/* Activity Breakdown */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Activity Breakdown</h3>
            <ApperIcon name="PieChart" className="h-5 w-5 text-secondary" />
          </div>
          <Chart
            options={activityData.options}
            series={activityData.series}
            type="donut"
            height={300}
          />
        </Card>

        {/* Performance Summary */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Performance Summary</h3>
            <ApperIcon name="Activity" className="h-5 w-5 text-success" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Leads Generated</span>
              <span className="text-white font-semibold">+{metrics.totalLeads}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Deals Closed</span>
              <span className="text-white font-semibold">+{metrics.wonLeads}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Revenue Generated</span>
              <span className="text-white font-semibold">+${metrics.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Active Contacts</span>
              <span className="text-white font-semibold">+{contacts.length}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Detailed Reports</h3>
          <Button variant="outline" size="sm">
            <ApperIcon name="Filter" className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="flex items-center justify-center gap-2 h-16">
            <ApperIcon name="FileText" className="h-5 w-5" />
            <span>Sales Report</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-2 h-16">
            <ApperIcon name="Activity" className="h-5 w-5" />
            <span>Activity Report</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-2 h-16">
            <ApperIcon name="Users" className="h-5 w-5" />
            <span>Contact Report</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Reports;