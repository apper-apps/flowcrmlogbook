import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Pipeline from "@/components/pages/Pipeline";
import Contacts from "@/components/pages/Contacts";
import Inbox from "@/components/pages/Inbox";
import Documents from "@/components/pages/Documents";
import Billing from "@/components/pages/Billing";
import Reports from "@/components/pages/Reports";
import Settings from "@/components/pages/Settings";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Pipeline />} />
          <Route path="pipeline" element={<Pipeline />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="documents" element={<Documents />} />
          <Route path="billing" element={<Billing />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ zIndex: 9999 }}
      />
    </>
  );
}

export default App;