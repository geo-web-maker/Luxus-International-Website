import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Career from "./pages/Career";
import JobDetail from "./pages/JobDetail";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminServices from "./pages/admin/AdminServices";
import AdminClients from "./pages/admin/AdminClients";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminContent from "./pages/admin/AdminContent";
import AdminSubmissions from "./pages/admin/AdminSubmissions";

export default function App() {
  return (
    <Routes>
      {/* Admin routes render outside <Layout> — no public header/footer. */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="clients" element={<AdminClients />} />
        <Route path="jobs" element={<AdminJobs />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="submissions" element={<AdminSubmissions />} />
      </Route>

      {/* Public site, wrapped in the shared Layout */}
      <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              {/* splat route resolves any depth, e.g. /ser/msc or /ser/msc/envms —
                  matches the `path` values stored in service group/child data. */}
              <Route path="/ser/*" element={<ServiceDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/career" element={<Career />} />
              <Route path="/career/:jobId" element={<JobDetail />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}
