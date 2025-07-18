import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import { contactsService } from "@/services/api/contactsService";
import { addContact } from "@/store/slices/contactsSlice";
import { useLanguage } from "@/hooks/useLanguage";

const CreateContactModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    position: "",
    status: "Active",
    source: "direct",
    tags: "",
    notes: ""
  });

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Pending", label: "Pending" }
  ];

  const sourceOptions = [
    { value: "direct", label: "Direct Contact" },
    { value: "referral", label: "Referral" },
    { value: "social", label: "Social Media" },
    { value: "networking", label: "Networking Event" },
    { value: "website", label: "Website" },
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
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required");
      return;
    }

    setLoading(true);
    try {
      const contactData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()) : [],
        source: formData.source || "direct"
      };

      const newContact = await contactsService.create(contactData);
      dispatch(addContact(newContact));
      toast.success("Contact created successfully");
      onClose();
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        position: "",
        status: "Active",
        source: "direct",
        tags: "",
        notes: ""
      });
    } catch (error) {
      toast.error("Failed to create contact");
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
            <h2 className="text-2xl font-bold text-white">Create New Contact</h2>
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
                placeholder="Enter contact name"
                required
              />
              <Input
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Enter company name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                required
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
                label="Position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="Enter job position"
              />
              <Select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                options={statusOptions}
              />
            </div>

            <Select
              label="Source"
              name="source"
              value={formData.source}
              onChange={handleInputChange}
              options={sourceOptions}
            />

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
                    Create Contact
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

export default CreateContactModal;