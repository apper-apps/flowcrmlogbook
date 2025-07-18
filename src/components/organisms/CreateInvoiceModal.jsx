import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import { billingService } from "@/services/api/billingService";
import { addInvoice } from "@/store/slices/billingSlice";
import { useLanguage } from "@/hooks/useLanguage";

const CreateInvoiceModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contactName: "",
    contactEmail: "",
    contactAddress: "",
    dueDate: "",
    items: [
      { description: "", quantity: 1, rate: 0, amount: 0 }
    ],
    notes: "",
    terms: "Payment is due within 30 days"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    
    if (field === 'quantity' || field === 'rate') {
      const quantity = parseFloat(newItems[index].quantity) || 0;
      const rate = parseFloat(newItems[index].rate) || 0;
      newItems[index].amount = quantity * rate;
    }
    
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.contactName || !formData.contactEmail) {
      toast.error("Contact name and email are required");
      return;
    }

    if (!formData.dueDate) {
      toast.error("Due date is required");
      return;
    }

    if (formData.items.some(item => !item.description)) {
      toast.error("All items must have descriptions");
      return;
    }

    setLoading(true);
    try {
      const invoiceData = {
        ...formData,
        total: calculateTotal(),
        subtotal: calculateTotal(),
        tax: 0,
        discount: 0
      };

      const newInvoice = await billingService.create(invoiceData);
      dispatch(addInvoice(newInvoice));
      toast.success("Invoice created successfully");
      onClose();
      setFormData({
        contactName: "",
        contactEmail: "",
        contactAddress: "",
        dueDate: "",
        items: [
          { description: "", quantity: 1, rate: 0, amount: 0 }
        ],
        notes: "",
        terms: "Payment is due within 30 days"
      });
    } catch (error) {
      toast.error("Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Create New Invoice</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Contact Information</h3>
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
                  label="Contact Email *"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="Enter contact email"
                  required
                />
              </div>
              <Textarea
                label="Contact Address"
                name="contactAddress"
                value={formData.contactAddress}
                onChange={handleInputChange}
                placeholder="Enter contact address"
                rows={2}
              />
            </div>

            {/* Invoice Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Invoice Details</h3>
              <Input
                label="Due Date *"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Line Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Line Items</h3>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 glass-dark rounded-lg">
                    <div className="md:col-span-5">
                      <Input
                        label="Description"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        placeholder="Item description"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Input
                        label="Quantity"
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        placeholder="1"
                        min="1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Input
                        label="Rate"
                        type="number"
                        value={item.rate}
                        onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Input
                        label="Amount"
                        type="number"
                        value={item.amount.toFixed(2)}
                        readOnly
                        className="bg-gray-700"
                      />
                    </div>
                    <div className="md:col-span-1 flex items-end">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeItem(index)}
                        disabled={formData.items.length === 1}
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-lg font-semibold text-white">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Additional Information</h3>
              <Textarea
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Additional notes or instructions"
                rows={2}
              />
              <Textarea
                label="Terms & Conditions"
                name="terms"
                value={formData.terms}
                onChange={handleInputChange}
                placeholder="Payment terms and conditions"
                rows={2}
              />
            </div>

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
                    Create Invoice
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

export default CreateInvoiceModal;