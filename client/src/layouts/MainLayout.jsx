import React from "react";
import { Container } from "react-bootstrap";
import Header from "../components/header/Header";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTopButton";

export default function MainLayout({ children }) {
  // Header is fixed="top" => ensure main has top padding so content isn't hidden
  return (
    <div className="min-vh-100">
      <Header />

      <main role="main">
        <Container fluid style={{ paddingTop: 88, paddingBottom: 32 }}>
          {children}
        </Container>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}