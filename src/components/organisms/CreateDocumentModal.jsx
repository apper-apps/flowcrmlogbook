import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import { documentsService } from "@/services/api/documentsService";
import { addDocument } from "@/store/slices/documentsSlice";
import { useLanguage } from "@/hooks/useLanguage";

const CreateDocumentModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "proposal",
    contactName: "",
    contactEmail: "",
    description: "",
    content: "",
    tags: ""
  });

  const typeOptions = [
    { value: "proposal", label: "Proposal" },
    { value: "contract", label: "Contract" },
    { value: "invoice", label: "Invoice" },
    { value: "quote", label: "Quote" },
    { value: "agreement", label: "Agreement" },
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
    if (!formData.title || !formData.contactName) {
      toast.error("Title and contact name are required");
      return;
    }

    setLoading(true);
    try {
      const documentData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()) : [],
        content: formData.content || `# ${formData.title}\n\n${formData.description || "Document content will be added here."}`
      };

      const newDocument = await documentsService.create(documentData);
      dispatch(addDocument(newDocument));
      toast.success("Document created successfully");
      onClose();
      setFormData({
        title: "",
        type: "proposal",
        contactName: "",
        contactEmail: "",
        description: "",
        content: "",
        tags: ""
      });
    } catch (error) {
      toast.error("Failed to create document");
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
            <h2 className="text-2xl font-bold text-white">Create New Document</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Title *"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter document title"
                required
              />
              <Select
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                options={typeOptions}
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
                label="Contact Email"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleInputChange}
                placeholder="Enter contact email"
              />
            </div>

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter document description"
              rows={2}
            />

            <Textarea
              label="Content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Enter document content (markdown supported)"
              rows={4}
            />

            <Input
              label="Tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="Enter tags separated by commas"
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
                    Create Document
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

export default CreateDocumentModal;