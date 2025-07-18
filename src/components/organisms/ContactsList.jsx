import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateContactModal from "@/components/organisms/CreateContactModal";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import ListView from "@/components/molecules/ListView";
import SearchBar from "@/components/molecules/SearchBar";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { useLanguage } from "@/hooks/useLanguage";
import { contactsService } from "@/services/api/contactsService";
import { setSectionFilters } from "@/store/slices/uiSlice";
import { setContacts, setError, setLoading } from "@/store/slices/contactsSlice";

const ContactsList = () => {
  const dispatch = useDispatch();
  const { contacts, loading, error, searchTerm } = useSelector((state) => state.contacts);
  const { sectionFilters } = useSelector((state) => state.ui.listView);
  const { t } = useLanguage();
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchTerm]);

  const loadContacts = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const data = await contactsService.getAll();
      dispatch(setContacts(data));
    } catch (error) {
      dispatch(setError(error.message));
      toast.error(t("error"));
    } finally {
      dispatch(setLoading(false));
    }
  };

const filterContacts = () => {
    if (!searchTerm) {
      setFilteredContacts(contacts);
      return;
    }

    const filtered = contacts.filter(contact =>
      contact.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContacts(filtered);
  };

  const handleSearch = (term) => {
    // Search is handled by Redux state
  };

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "error";
      case "Pending":
        return "warning";
      default:
        return "default";
    }
  };

if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadContacts} />;
  }

  if (filteredContacts.length === 0) {
    return (
      <Card className="p-8 text-center">
        <ApperIcon name="Users" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">
          {searchTerm ? "No contacts found" : "No contacts yet"}
        </h3>
        <p className="text-gray-400 mb-4">
          {searchTerm 
            ? "Try adjusting your search terms"
            : "Start by adding your first contact to begin building your network"
}
        </p>
        <Button onClick={() => setShowCreateModal(true)}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          {t("addContact")}
        </Button>
      </Card>
    );
  }

const filters = [
    { label: "All Contacts", value: "all" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "Pending", value: "pending" }
  ];

  const handleFilterChange = (filters) => {
    dispatch(setSectionFilters({ section: "contacts", filters }));
  };

  const renderContactItem = (contact, { rowSize }) => (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-200"
      onClick={() => handleContactClick(contact)}
    >
      <div className="flex items-center justify-between">
<div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {contact.Name?.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-white">{contact.Name}</h3>
            <p className="text-sm text-gray-400">{contact.company}</p>
            {rowSize !== "small" && (
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <ApperIcon name="Mail" className="h-3 w-3" />
                  {contact.email}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <ApperIcon name="Phone" className="h-3 w-3" />
                  {contact.phone}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <Badge variant={getStatusColor(contact.status)}>
              {contact.status}
            </Badge>
            {rowSize !== "small" && (
<p className="text-xs text-gray-400 mt-1">
                {format(new Date(contact.last_activity || contact.lastActivity), "MMM dd, yyyy")}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm">
              <ApperIcon name="Mail" className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ApperIcon name="Phone" className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ApperIcon name="MoreHorizontal" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <ListView
          items={filteredContacts}
          renderItem={renderContactItem}
          filters={filters}
          section="contacts"
          onFilterChange={handleFilterChange}
          selectedFilters={sectionFilters.contacts}
          emptyState={
            <Card className="p-8 text-center">
              <ApperIcon name="Users" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                {searchTerm ? "No contacts found" : "No contacts yet"}
              </h3>
              <p className="text-gray-400 mb-4">
                {searchTerm 
? "Try adjusting your search terms"
                  : "Start by adding your first contact to begin building your network"
                }
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                {t("addContact")}
              </Button>
            </Card>
          }
        />
      </div>
      
      {selectedContact && (
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-4">
<span className="text-xl font-bold text-white">
                  {selectedContact.Name?.charAt(0)}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white">{selectedContact.Name}</h3>
              <p className="text-gray-400">{selectedContact.company}</p>
              <Badge variant={getStatusColor(selectedContact.status)} className="mt-2">
                {selectedContact.status}
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <ApperIcon name="Mail" className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-white">{selectedContact.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <ApperIcon name="Phone" className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-white">{selectedContact.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <ApperIcon name="Clock" className="h-4 w-4 text-gray-400" />
<span className="text-sm text-white">
                  Last activity: {format(new Date(selectedContact.last_activity || selectedContact.lastActivity), "MMM dd, yyyy")}
                </span>
              </div>
            </div>
            
            <div className="mt-6 space-y-2">
              <Button className="w-full">
                <ApperIcon name="Mail" className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full">
                <ApperIcon name="Phone" className="h-4 w-4 mr-2" />
                Call
              </Button>
<Button variant="outline" className="w-full">
              <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
              Edit Contact
            </Button>
          </div>
        </Card>
      </div>
    )}
      
      <CreateContactModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </div>
  );
};

export default ContactsList;