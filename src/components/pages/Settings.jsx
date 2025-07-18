import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import PipelineBoard from "@/components/organisms/PipelineBoard";
import Pipeline from "@/components/pages/Pipeline";
import Billing from "@/components/pages/Billing";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import useLanguage from "@/hooks/useLanguage";
import { setLanguage } from "@/store/slices/uiSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const { language } = useSelector((state) => state.ui);
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("general");
  const [showPipelineView, setShowPipelineView] = useState(false);

  const tabs = [
    { id: "general", label: "General", icon: "Settings" },
    { id: "integrations", label: "Integrations", icon: "Plug" },
    { id: "notifications", label: "Notifications", icon: "Bell" },
    { id: "team", label: "Team", icon: "Users" },
    { id: "billing", label: "Billing", icon: "CreditCard" },
  ];

  const integrations = [
    { name: "Google Calendar", status: "connected", icon: "Calendar" },
    { name: "Outlook", status: "disconnected", icon: "Mail" },
    { name: "LinkedIn", status: "connected", icon: "Linkedin" },
    { name: "WhatsApp", status: "connected", icon: "MessageCircle" },
    { name: "Zapier", status: "disconnected", icon: "Zap" },
    { name: "Slack", status: "disconnected", icon: "MessageSquare" },
  ];

  const handleLanguageChange = (newLanguage) => {
    dispatch(setLanguage(newLanguage));
    toast.success(`Language changed to ${newLanguage === "en" ? "English" : "Español"}`);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Language & Region</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Language"
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </Select>
          <Select label="Timezone">
            <option value="UTC">UTC</option>
            <option value="EST">Eastern Time</option>
            <option value="PST">Pacific Time</option>
          </Select>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Company Name" defaultValue="FlowCRM Inc." />
          <Input label="Website" defaultValue="https://flowcrm.com" />
          <Input label="Phone" defaultValue="+1 (555) 123-4567" />
          <Input label="Email" defaultValue="info@flowcrm.com" />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
            </div>
            <Button variant="outline" size="sm">Enable</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Session Timeout</p>
              <p className="text-sm text-gray-400">Automatically log out after inactivity</p>
            </div>
            <Select className="w-32">
              <option value="30">30 min</option>
              <option value="60">1 hour</option>
              <option value="240">4 hours</option>
            </Select>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Connected Apps</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration) => (
            <div key={integration.name} className="flex items-center justify-between p-4 glass-dark rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20">
                  <ApperIcon name={integration.icon} className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-white font-medium">{integration.name}</p>
                  <Badge 
                    variant={integration.status === "connected" ? "success" : "default"}
                    size="sm"
                  >
                    {integration.status}
                  </Badge>
                </div>
              </div>
              <Button 
                variant={integration.status === "connected" ? "outline" : "primary"}
                size="sm"
              >
                {integration.status === "connected" ? "Disconnect" : "Connect"}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">API Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">API Access</p>
              <p className="text-sm text-gray-400">Generate API keys for custom integrations</p>
            </div>
            <Button variant="outline" size="sm">Generate Key</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Webhooks</p>
              <p className="text-sm text-gray-400">Configure webhook endpoints</p>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Email Notifications</h3>
        <div className="space-y-4">
          {[
            { label: "New leads", description: "Get notified when new leads are added" },
            { label: "Deal updates", description: "Updates on deal stage changes" },
            { label: "Payment reminders", description: "Overdue invoice notifications" },
            { label: "Weekly reports", description: "Weekly performance summary" },
          ].map((notification) => (
            <div key={notification.label} className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{notification.label}</p>
                <p className="text-sm text-gray-400">{notification.description}</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-white/20 bg-transparent text-primary focus:ring-primary/50"
              />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Push Notifications</h3>
        <div className="space-y-4">
          {[
            { label: "Browser notifications", description: "Desktop notifications in your browser" },
            { label: "Mobile push", description: "Push notifications on mobile devices" },
            { label: "Slack notifications", description: "Send notifications to Slack channels" },
          ].map((notification) => (
            <div key={notification.label} className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{notification.label}</p>
                <p className="text-sm text-gray-400">{notification.description}</p>
              </div>
              <input
                type="checkbox"
                defaultChecked={notification.label === "Browser notifications"}
                className="rounded border-white/20 bg-transparent text-primary focus:ring-primary/50"
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderTeamSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Team Members</h3>
          <Button>
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </div>
        <div className="space-y-4">
          {[
            { name: "John Doe", email: "john@company.com", role: "Admin" },
            { name: "Jane Smith", email: "jane@company.com", role: "Sales Manager" },
            { name: "Mike Johnson", email: "mike@company.com", role: "Sales Rep" },
          ].map((member) => (
            <div key={member.email} className="flex items-center justify-between p-4 glass-dark rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <span className="text-sm font-medium text-white">{member.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-white font-medium">{member.name}</p>
                  <p className="text-sm text-gray-400">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="primary" size="sm">{member.role}</Badge>
                <Button variant="ghost" size="sm">
                  <ApperIcon name="MoreHorizontal" className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Permissions</h3>
        <div className="space-y-4">
          {[
            { role: "Admin", permissions: "Full access to all features" },
            { role: "Sales Manager", permissions: "Manage team, view all reports" },
            { role: "Sales Rep", permissions: "Manage own leads and contacts" },
          ].map((role) => (
            <div key={role.role} className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{role.role}</p>
                <p className="text-sm text-gray-400">{role.permissions}</p>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderBillingSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Current Plan</h3>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xl font-bold text-white">Professional Plan</p>
            <p className="text-gray-400">$49/month • Up to 10 users</p>
          </div>
          <Badge variant="success">Active</Badge>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">Change Plan</Button>
          <Button variant="outline">Cancel Subscription</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20">
              <ApperIcon name="CreditCard" className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-white font-medium">•••• •••• •••• 1234</p>
              <p className="text-sm text-gray-400">Expires 12/25</p>
            </div>
          </div>
          <Button variant="outline" size="sm">Update</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Billing History</h3>
        <div className="space-y-4">
          {[
            { date: "Jan 1, 2024", amount: "$49.00", status: "Paid" },
            { date: "Dec 1, 2023", amount: "$49.00", status: "Paid" },
            { date: "Nov 1, 2023", amount: "$49.00", status: "Paid" },
          ].map((invoice, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{invoice.date}</p>
                <p className="text-sm text-gray-400">{invoice.amount}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success" size="sm">{invoice.status}</Badge>
                <Button variant="ghost" size="sm">
                  <ApperIcon name="Download" className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t("settings")}</h1>
          <p className="text-gray-400 mt-1">
            Configure your CRM preferences and integrations
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
        </div>
      </div>

      {showPipelineView ? (
        <PipelineBoard />
      ) : (
        <>
          {/* Settings Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/20"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <ApperIcon name={tab.icon} className="h-4 w-4" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </Card>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {activeTab === "general" && renderGeneralSettings()}
              {activeTab === "integrations" && renderIntegrations()}
              {activeTab === "notifications" && renderNotifications()}
              {activeTab === "team" && renderTeamSettings()}
              {activeTab === "billing" && renderBillingSettings()}
            </div>
          </div>
        </>
)}
    </div>
  );
};

export default Settings;