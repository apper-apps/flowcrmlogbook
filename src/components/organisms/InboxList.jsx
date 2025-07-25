import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Card from "@/components/atoms/Card";
import Textarea from "@/components/atoms/Textarea";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ListView from "@/components/molecules/ListView";
import ComposeMessageModal from "@/components/organisms/ComposeMessageModal";
import useLanguage from "@/hooks/useLanguage";
import { inboxService } from "@/services/api/inboxService";
import { setActiveThread, setError, setLoading, setMessages } from "@/store/slices/inboxSlice";
import { setSectionFilters } from "@/store/slices/uiSlice";
const InboxList = () => {
  const dispatch = useDispatch();
  const { messages, loading, error, activeThread } = useSelector((state) => state.inbox);
  const { sectionFilters } = useSelector((state) => state.ui.listView);
  const { t } = useLanguage();
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [filter, setFilter] = useState("all");
  const [replyText, setReplyText] = useState("");
  const [showComposeModal, setShowComposeModal] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, filter]);

  const loadMessages = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const data = await inboxService.getAll();
      dispatch(setMessages(data));
    } catch (error) {
      dispatch(setError(error.message));
      toast.error(t("error"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const filterMessages = () => {
    let filtered = messages;
    
    if (filter === "unread") {
      filtered = messages.filter(msg => !msg.isRead);
    } else if (filter === "email") {
      filtered = messages.filter(msg => msg.channel === "email");
    } else if (filter === "linkedin") {
      filtered = messages.filter(msg => msg.channel === "linkedin");
    }
    
    setFilteredMessages(filtered);
  };

  const handleMessageClick = (message) => {
    dispatch(setActiveThread(message));
  };

  const handleReply = async () => {
    if (!replyText.trim() || !activeThread) return;

    try {
      const newMessage = {
        channel: activeThread.channel,
        contactId: activeThread.contactId,
        subject: `Re: ${activeThread.subject}`,
        body: replyText,
        timestamp: new Date().toISOString(),
        isRead: true,
        threadId: activeThread.threadId,
        isOutbound: true
      };

      await inboxService.create(newMessage);
      setReplyText("");
      loadMessages();
      toast.success("Message sent successfully");
    } catch (error) {
      toast.error(t("error"));
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case "email":
        return "Mail";
      case "linkedin":
        return "Linkedin";
      case "whatsapp":
        return "MessageCircle";
      case "facebook":
        return "Facebook";
      case "instagram":
        return "Instagram";
      default:
        return "Mail";
    }
  };

  const getChannelColor = (channel) => {
    switch (channel) {
      case "email":
        return "info";
      case "linkedin":
        return "primary";
      case "whatsapp":
        return "success";
      case "facebook":
        return "secondary";
      case "instagram":
        return "accent";
      default:
        return "default";
}
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadMessages} />;
  }

  if (filteredMessages.length === 0) {
    return (
      <Card className="p-8 text-center">
        <ApperIcon name="Mail" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">
          {filter === "unread" ? "No unread messages" : "No messages yet"}
        </h3>
        <p className="text-gray-400 mb-4">
          {filter === "unread" 
            ? "You're all caught up! No new messages to review."
: "Start conversations with your leads to see messages here"
          }
        </p>
        <Button onClick={() => setShowComposeModal(true)}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          {t("compose")}
        </Button>
      </Card>
    );
  }

const filters = [
    { label: "All Messages", value: "all" },
    { label: "Unread", value: "unread" },
    { label: "Email", value: "email" },
    { label: "LinkedIn", value: "linkedin" },
    { label: "WhatsApp", value: "whatsapp" },
    { label: "Facebook", value: "facebook" },
    { label: "Instagram", value: "instagram" }
  ];

  const handleFilterChange = (filters) => {
    dispatch(setSectionFilters({ section: "inbox", filters }));
  };

  const renderMessageItem = (message, { rowSize }) => (
    <Card
      className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${
        !message.isRead ? "border-l-4 border-primary" : ""
      }`}
      onClick={() => handleMessageClick(message)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <ApperIcon name={getChannelIcon(message.channel)} className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-semibold ${!message.isRead ? "text-white" : "text-gray-300"}`}>
                {message.contactName}
              </h3>
              <Badge variant={getChannelColor(message.channel)} size="sm">
                {message.channel}
              </Badge>
            </div>
            <p className={`text-sm ${!message.isRead ? "text-gray-300" : "text-gray-400"}`}>
              {message.subject}
            </p>
            {rowSize !== "small" && (
              <p className="text-xs text-gray-500 mt-1 truncate">
                {message.body}
              </p>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-xs text-gray-400">
            {format(new Date(message.timestamp), "MMM dd, HH:mm")}
          </p>
          {!message.isRead && (
            <div className="w-2 h-2 bg-primary rounded-full mt-2 ml-auto"></div>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        {/* Filter Tabs */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant={filter === "all" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All Messages
          </Button>
          <Button
            variant={filter === "unread" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setFilter("unread")}
          >
            Unread
          </Button>
          <Button
            variant={filter === "email" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setFilter("email")}
          >
            Email
          </Button>
          <Button
            variant={filter === "linkedin" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setFilter("linkedin")}
          >
            LinkedIn
          </Button>
        </div>

<ListView
          items={filteredMessages}
          renderItem={renderMessageItem}
          filters={filters}
          section="inbox"
          onFilterChange={handleFilterChange}
          selectedFilters={sectionFilters.inbox}
          emptyState={
            <Card className="p-8 text-center">
              <ApperIcon name="Mail" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                {filter === "unread" ? "No unread messages" : "No messages yet"}
              </h3>
              <p className="text-gray-400 mb-4">
                {filter === "unread" 
                  ? "You're all caught up! No new messages to review."
: "Start conversations with your leads to see messages here"
                }
              </p>
              <Button onClick={() => setShowComposeModal(true)}>
                <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                {t("compose")}
              </Button>
            </Card>
          }
        />
      </div>
      
      {/* Message Thread */}
      {activeThread && (
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ApperIcon name={getChannelIcon(activeThread.channel)} className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-white">{activeThread.contactName}</h3>
              </div>
              <Badge variant={getChannelColor(activeThread.channel)} size="sm">
                {activeThread.channel}
              </Badge>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="p-4 glass-dark rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{activeThread.subject}</span>
                  <span className="text-xs text-gray-400">
                    {format(new Date(activeThread.timestamp), "MMM dd, HH:mm")}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{activeThread.body}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <Textarea
                label="Reply"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                rows={4}
              />
              <div className="flex gap-2">
                <Button onClick={handleReply} className="flex-1">
                  <ApperIcon name="Send" className="h-4 w-4 mr-2" />
                  Send
                </Button>
                <Button variant="outline">
                  <ApperIcon name="Paperclip" className="h-4 w-4" />
                </Button>
              </div>
            </div>
</Card>
        </div>
      )}
      
      <ComposeMessageModal 
        isOpen={showComposeModal} 
        onClose={() => setShowComposeModal(false)} 
      />
    </div>
  );
};
export default InboxList;