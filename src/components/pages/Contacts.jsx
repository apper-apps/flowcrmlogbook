import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setContacts, setLoading, setError, setSearchTerm } from "@/store/slices/contactsSlice";
import { contactsService } from "@/services/api/contactsService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import StatCard from "@/components/molecules/StatCard";
import ContactsList from "@/components/organisms/ContactsList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "react-toastify";

const Contacts = () => {
  const dispatch = useDispatch();
  const { contacts, loading, error, searchTerm } = useSelector((state) => state.contacts);
  const { t } = useLanguage();

  useEffect(() => {
    loadContacts();
  }, []);
const loadContacts = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const data = await contactsService.getAll();
      dispatch(setContacts(data));
      dispatch(setError(null)); // Ensure error is cleared on success
    } catch (error) {
      console.error('Contacts loading error:', error);
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

  const handleSearch = (term) => {
    dispatch(setSearchTerm(term));
  };

  const getActiveContacts = () => {
    return contacts.filter(contact => contact.status === "Active").length;
  };

  const getRecentContacts = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return contacts.filter(contact => new Date(contact.lastActivity) >= thirtyDaysAgo).length;
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadContacts} />;
  }

  if (contacts.length === 0) {
    return (
      <Empty
        icon="Users"
        title="No contacts yet"
        description="Start building your network by adding your first contact"
        actionLabel="Add Contact"
        onAction={() => toast.info("Contact creation coming soon!")}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t("contacts")}</h1>
          <p className="text-gray-400 mt-1">
            Manage your contacts and build relationships
          </p>
        </div>
        <div className="flex items-center gap-4">
          <SearchBar
            placeholder="Search contacts..."
            onSearch={handleSearch}
            className="w-80"
          />
          <Button>
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            {t("addContact")}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Contacts"
          value={contacts.length}
          icon="Users"
          trend="up"
          trendValue="+15"
        />
        <StatCard
          title="Active Contacts"
          value={getActiveContacts()}
          icon="UserCheck"
          trend="up"
          trendValue="+8"
        />
        <StatCard
          title="Recent Activity"
          value={getRecentContacts()}
          icon="Activity"
          trend="up"
          trendValue="+12"
        />
        <StatCard
          title="Avg. Response Time"
          value="2.5h"
          icon="Clock"
          trend="down"
          trendValue="-15m"
        />
      </div>

      {/* Contacts List */}
      <ContactsList />
    </div>
  );
};

export default Contacts;