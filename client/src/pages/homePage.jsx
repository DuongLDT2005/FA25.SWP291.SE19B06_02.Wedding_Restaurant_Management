import React from "react";
import "../styles/homePageStyles.css"
import SearchBar from "../components/SearchBar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContentHomePage from "./ContentHomePage";
import ScrollToTopButton from "../components/ScrollToTopButton";
function Content() {
    return (
        <>
            <Header />
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