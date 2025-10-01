import React from "react";
import "../styles/homePageStyles.css"
import SearchBar from "../components/SearchBar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
function Content() {
    return (
        <>
            <Header />
            <div className="home-container">
                <SearchBar />
                <div className="content">
                    {/* Content 1 */}
                    <div className="content--section">
                        <h2>Content 1</h2>
                        <div className="content--list">
                            <Link to="/restaurant/details">
                                <div className="content--card">
                                    <div className="content--image">
                                        <img src="/assets/img/wedding_main.jpg" alt="Image-wedding" />
                                    </div>
                                    <div className="content--info">
                                        <h3>Wedding X</h3>
                                        <div className="content--price">
                                            <i className="fa-solid fa-dollar-sign"></i>
                                            <h5>XXX/night</h5>
                                        </div>
                                        <p>123 Street, City, Country</p>
                                    </div>
                                </div>
                            </Link>
                            <div className="content--card">
                                <div className="content--image">
                                    <img src="/assets/img/wedding_main.jpg" alt="Image-wedding" />
                                </div>
                                <div className="content--info">
                                    <h3>Wedding X</h3>
                                    <div className="content--price">
                                        <i className="fa-solid fa-dollar-sign"></i>
                                        <h5>XXX/night</h5>
                                    </div>
                                    <p>123 Street, City, Country</p>
                                </div>
                            </div>
                            <div className="content--card">
                                <div className="content--image">
                                    <img src="/assets/img/wedding_main.jpg" alt="Image-wedding" />
                                </div>
                                <div className="content--info">
                                    <h3>Wedding X</h3>
                                    <div className="content--price">
                                        <i className="fa-solid fa-dollar-sign"></i>
                                        <h5>XXX/night</h5>
                                    </div>
                                    <p>123 Street, City, Country</p>
                                </div>
                            </div>
                            <div className="content--card">
                                <div className="content--image">
                                    <img src="/assets/img/wedding_main.jpg" alt="Image-wedding" />
                                </div>
                                <div className="content--info">
                                    <h3>Wedding X</h3>
                                    <div className="content--price">
                                        <i className="fa-solid fa-dollar-sign"></i>
                                        <h5>XXX/night</h5>
                                    </div>
                                    <p>123 Street, City, Country</p>
                                </div>
                            </div>
                            <div className="content--card">
                                <div className="content--image">
                                    <img src="/assets/img/wedding_main.jpg" alt="Image-wedding" />
                                </div>
                                <div className="content--info">
                                    <h3>Wedding X</h3>
                                    <div className="content--price">
                                        <i className="fa-solid fa-dollar-sign"></i>
                                        <h5>XXX/night</h5>
                                    </div>
                                    <p>123 Street, City, Country</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content 2 */}
                    <div className="content--section">
                        <h2>Content 2</h2>
                        <div className="content--list">
                            <div className="content--card">
                                <div className="content--image">
                                    <img src="/assets/img/wedding_main.jpg" alt="Image-wedding" />
                                </div>
                                <div className="content--info">
                                    <h3>Wedding X</h3>
                                    <div className="content--price">
                                        <i className="fa-solid fa-dollar-sign"></i>
                                        <h5>XXX/night</h5>
                                    </div>
                                    <p>123 Street, City, Country</p>
                                </div>
                            </div>
                            <div className="content--card">
                                <div className="content--image">
                                    <img src="/assets/img/wedding_main.jpg" alt="Image-wedding" />
                                </div>
                                <div className="content--info">
                                    <h3>Wedding X</h3>
                                    <div className="content--price">
                                        <i className="fa-solid fa-dollar-sign"></i>
                                        <h5>XXX/night</h5>
                                    </div>
                                    <p>123 Street, City, Country</p>
                                </div>
                            </div>
                            <div className="content--card">
                                <div className="content--image">
                                    <img src="/assets/img/wedding_main.jpg" alt="Image-wedding" />
                                </div>
                                <div className="content--info">
                                    <h3>Wedding X</h3>
                                    <div className="content--price">
                                        <i className="fa-solid fa-dollar-sign"></i>
                                        <h5>XXX/night</h5>
                                    </div>
                                    <p>123 Street, City, Country</p>
                                </div>
                            </div>
                            <div className="content--card">
                                <div className="content--image">
                                    <img src="/assets/img/wedding_main.jpg" alt="Image-wedding" />
                                </div>
                                <div className="content--info">
                                    <h3>Wedding X</h3>
                                    <div className="content--price">
                                        <i className="fa-solid fa-dollar-sign"></i>
                                        <h5>XXX/night</h5>
                                    </div>
                                    <p>123 Street, City, Country</p>
                                </div>
                            </div>
                            <div className="content--card">
                                <div className="content--image">
                                    <img src="/assets/img/wedding_main.jpg" alt="Image-wedding" />
                                </div>
                                <div className="content--info">
                                    <h3>Wedding X</h3>
                                    <div className="content--price">
                                        <i className="fa-solid fa-dollar-sign"></i>
                                        <h5>XXX/night</h5>
                                    </div>
                                    <p>123 Street, City, Country</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );

}
export default Content;