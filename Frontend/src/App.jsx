import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Career from "./pages/Career";
import JobDetail from "./pages/JobDetail";
import AdminGuard from "./admin/AdminGuard";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminServices from "./admin/pages/AdminServices";
import AdminJobs from "./admin/pages/AdminJobs";
import AdminSubmissions from "./admin/pages/AdminSubmissions";
import AdminContent from "./admin/pages/AdminContent";

function Admin() {
  return (
    <AdminGuard>
      <AdminLayout>
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="submissions" element={<AdminSubmissions />} />
          <Route path="content" element={<AdminContent />} />
        </Routes>
      </AdminLayout>
    </AdminGuard>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Admin has its own shell (no public navbar/footer) and its own nested routes. */}
      <Route path="/admin/*" element={<Admin />} />
      <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              {/* splat route resolves any depth, e.g. /services/msc or /services/msc/envms */}
              <Route path="/services/*" element={<ServiceDetail />} />
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
