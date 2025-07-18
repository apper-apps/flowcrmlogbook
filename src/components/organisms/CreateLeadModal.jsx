import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import { pipelineService } from "@/services/api/pipelineService";
import { addLead } from "@/store/slices/pipelineSlice";
import { useLanguage } from "@/hooks/useLanguage";

const CreateLeadModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    value: "",
    stage: "new",
    source: "website",
    owner: "",
    tags: "",
    notes: ""
  });

  const stageOptions = [
    { value: "new", label: "New" },
    { value: "qualified", label: "Qualified" },
    { value: "proposal", label: "Proposal" },
    { value: "negotiation", label: "Negotiation" },
    { value: "closedWon", label: "Closed Won" },
    { value: "closedLost", label: "Closed Lost" }
  ];

  const sourceOptions = [
    { value: "website", label: "Website" },
    { value: "referral", label: "Referral" },
    { value: "social", label: "Social Media" },
    { value: "email", label: "Email Campaign" },
    { value: "cold", label: "Cold Outreach" },
    { value: "other", label: "Other" }
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
    if (!formData.name || !formData.company) {
      toast.error("Name and company are required");
      return;
    }

    setLoading(true);
    try {
const leadData = {
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        value: formData.value ? parseFloat(formData.value) : 0,
        stage: formData.stage,
        source: formData.source || "website",
        tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()) : [],
        notes: formData.notes
      };

      const newLead = await pipelineService.create(leadData);
      dispatch(addLead(newLead));
      toast.success("Lead created successfully");
      onClose();
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        value: "",
        stage: "new",
        source: "website",
        owner: "",
        tags: "",
        notes: ""
      });
    } catch (error) {
      toast.error("Failed to create lead");
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
            <h2 className="text-2xl font-bold text-white">Create New Lead</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Name *"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter lead name"
                required
              />
              <Input
                label="Company *"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Enter company name"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
              />
              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Value"
                name="value"
                type="number"
                value={formData.value}
                onChange={handleInputChange}
                placeholder="Enter deal value"
              />
              <Input
                label="Owner"
                name="owner"
                value={formData.owner}
                onChange={handleInputChange}
                placeholder="Enter owner name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Stage"
                name="stage"
                value={formData.stage}
                onChange={handleInputChange}
                options={stageOptions}
              />
              <Select
                label="Source"
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                options={sourceOptions}
              />
            </div>

            <Input
              label="Tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="Enter tags separated by commas"
            />

            <Textarea
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Enter additional notes"
              rows={3}
            />

            <div className="flex items-center gap-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                    Create Lead
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

export default CreateLeadModal;