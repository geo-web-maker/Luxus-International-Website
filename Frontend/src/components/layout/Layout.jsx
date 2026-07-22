import TopBar from "./TopBar";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="site">
      <TopBar />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
