import Header from "../components/header/Header";
import Footer from "../components/Footer";
import { AuthProvider } from "../context/AuthContext";
import ScrollToTop from "../components/ScrollToTopButton";

export default function MainLayout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AuthProvider>
        <Header />
      </AuthProvider>

      <main className="flex-grow-1">
        {children} 
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
