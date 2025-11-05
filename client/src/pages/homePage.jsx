import React from "react";
import "../styles/homePageStyles.css"
import SearchBar from "../components/SearchBar";
import Header from "../components/header/Header";
import Footer from "../components/Footer";
import ContentHomePage from "./ContentHomePage";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { AuthProvider } from "../context/AuthContext";
function Content() {
    return (
        <>
            <AuthProvider>
                <Header />
            </AuthProvider>
            <div className="home-container">
                <SearchBar />
                <div className="content">
                    <ContentHomePage />
                </div>
            </div>
            <ScrollToTopButton />
            <Footer />
        </>
    );

}
export default Content;