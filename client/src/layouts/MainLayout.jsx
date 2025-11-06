import React from "react";
import { Container } from "react-bootstrap";
import Header from "../components/header/Header";
import Footer from "../components/Footer";

export default function MainLayout({ children }) {
  // Header is fixed="top" => ensure main has top padding so content isn't hidden
  return (
    <div>
      <Header />

      <main role="main">
        <Container fluid style={{ paddingTop: 88, paddingBottom: 32 }}>
          <Container style={{ maxWidth: 1200 }}>{children}</Container>
        </Container>
      </main>

      <Footer />
    </div>
  );
}