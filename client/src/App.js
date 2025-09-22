import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Header from './components/Header';
import Content from './pages/homePage';
import Footer from './components/Footer';
import SignUp from './pages/auth/signUp/signUpForOwner';
import HeaderWithoutSearch from "./components/HeaderWithoutSearch";
import "./styles/generalStyles.css"; // Import file CSS chung
import React from 'react';
import "@fortawesome/fontawesome-free/css/all.min.css";

function MainLayout({ children }) {
  return (
    <>
      {<Header />}
      {children}
      {<Footer />}
    </>

  );
}

function AuthLayout({ children }) {
  return (
    <>
      {<HeaderWithoutSearch />}
      {children}
      {<Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout><Content /></MainLayout>} />
        <Route path="/signUpForOwner" element={<AuthLayout><SignUp /></AuthLayout>} />
      </Routes>
    </Router>

  );
}

export default App;
