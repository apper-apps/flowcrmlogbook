import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import { inboxService } from "@/services/api/inboxService";
import { addMessage } from "@/store/slices/inboxSlice";
import { useLanguage } from "@/hooks/useLanguage";

const ComposeMessageModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    channel: "email",
    contactName: "",
    contactEmail: "",
    subject: "",
    body: "",
    priority: "normal"
  });

  const channelOptions = [
    { value: "email", label: "Email" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "whatsapp", label: "WhatsApp" },
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" }
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "normal", label: "Normal" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.contactName || !formData.subject || !formData.body) {
      toast.error("Contact name, subject, and message are required");
      return;
    }

    if (formData.channel === "email" && !formData.contactEmail) {
      toast.error("Email address is required for email messages");
      return;
    }

    setLoading(true);
    try {
      const messageData = {
        ...formData,
        isOutbound: true,
        threadId: `thread_${Date.now()}`,
        contactId: Math.floor(Math.random() * 1000) + 1
      };

      const newMessage = await inboxService.create(messageData);
      dispatch(addMessage(newMessage));
      toast.success("Message sent successfully");
      onClose();
      setFormData({
        channel: "email",
        contactName: "",
        contactEmail: "",
        subject: "",
        body: "",
        priority: "normal"
      });
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Compose Message</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Channel"
                name="channel"
                value={formData.channel}
                onChange={handleInputChange}
                options={channelOptions}
              />
              <Select
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                options={priorityOptions}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Contact Name *"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                placeholder="Enter contact name"
                required
              />
              <Input
                label={`Contact ${formData.channel === "email" ? "Email *" : "Handle"}`}
                name="contactEmail"
                type={formData.channel === "email" ? "email" : "text"}
                value={formData.contactEmail}
                onChange={handleInputChange}
                placeholder={
                  formData.channel === "email" 
                    ? "Enter email address" 
                    : `Enter ${formData.channel} handle`
                }
                required={formData.channel === "email"}
              />
            </div>

            <Input
              label="Subject *"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Enter message subject"
              required
            />

            <Textarea
              label="Message *"
              name="body"
              value={formData.body}
              onChange={handleInputChange}
              placeholder="Enter your message"
              rows={6}
              required
            />

            <div className="flex items-center gap-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Send" className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ComposeMessageModal;