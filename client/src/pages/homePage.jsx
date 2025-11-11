import React from "react";
import "../styles/homePageStyles.css";
import SearchBar from "../components/searchbar/SearchBar";
import Header from "../components/header/Header";
import Footer from "../components/Footer";
import ContentHomePage from "./ContentHomePage";
import ScrollToTopButton from "../components/ScrollToTopButton";
import HeroSection from "../components/HeroSection";
function Content() {
    return (
        <>
            <Header />
            <div className="home-container">
                <HeroSection />
                <div className="search-section py-5">
                    <SearchBar />
                </div>
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
