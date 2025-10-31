import Header from "../components/Header"
import Footer from "../components/Footer"

export default function AuthLayout({ children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>{children}</main>

      <Footer />
    </div>
  )
}
