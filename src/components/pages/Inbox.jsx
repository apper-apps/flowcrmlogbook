import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import InboxList from "@/components/organisms/InboxList";
import PipelineBoard from "@/components/organisms/PipelineBoard";
import Pipeline from "@/components/pages/Pipeline";
import StatCard from "@/components/molecules/StatCard";
import Button from "@/components/atoms/Button";
import useLanguage from "@/hooks/useLanguage";
import { inboxService } from "@/services/api/inboxService";
import { setError, setLoading, setMessages } from "@/store/slices/inboxSlice";

const Inbox = () => {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.inbox);
  const { t } = useLanguage();
  const [showPipelineView, setShowPipelineView] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

const loadMessages = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const data = await inboxService.getAll();
      dispatch(setMessages(data));
      dispatch(setError(null)); // Ensure error is cleared on success
    } catch (error) {
      console.error('Messages loading error:', error);
      dispatch(setError(error.message));
      dispatch(setLoading(false)); // Ensure loading is reset on error
      toast.error(error.message.includes('timeout') ? 
        'Connection timeout. Please try again.' : 
        t("error"));
      return; // Exit early to prevent finally block from resetting loading
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getUnreadCount = () => {
    return messages.filter(msg => !msg.isRead).length;
  };

  const getTodayMessages = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return messages.filter(msg => new Date(msg.timestamp) >= today).length;
  };

  const getResponseTime = () => {
    // Mock calculation - in real app, calculate based on actual response times
    return "1.2h";
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadMessages} />;
  }

  if (messages.length === 0) {
    return (
      <Empty
        icon="Mail"
        title="No messages yet"
        description="Your unified inbox will show messages from all connected channels"
        actionLabel="Compose Message"
        onAction={() => toast.info("Message composition coming soon!")}
      />
    );
  }

return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t("inbox")}</h1>
          <p className="text-gray-400 mt-1">
            Unified inbox for all your communication channels
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
            <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
            Sync All
          </Button>
          <Button>
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            {t("compose")}
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
              title="Total Messages"
              value={messages.length}
              icon="Mail"
              trend="up"
              trendValue="+23"
            />
            <StatCard
              title="Unread Messages"
              value={getUnreadCount()}
              icon="MailOpen"
              trend="down"
              trendValue="-5"
            />
            <StatCard
              title="Today's Messages"
              value={getTodayMessages()}
              icon="Clock"
              trend="up"
              trendValue="+8"
            />
            <StatCard
              title="Avg. Response Time"
              value={getResponseTime()}
              icon="Timer"
              trend="down"
              trendValue="-0.3h"
            />
          </div>

          {/* Inbox List */}
          <InboxList />
        </>
)}
    </div>
  );
};

export default Inbox;