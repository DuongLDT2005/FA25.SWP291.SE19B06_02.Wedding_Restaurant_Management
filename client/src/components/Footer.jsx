import React from "react";
import "../styles/Footer.css"
import { Link } from "react-router-dom";
function Footer() {
    return(
         <footer className="footer">
        <div className="footer-container">
            {/* Logo Section */}
            <div className="footer-logo">
                <img src={"https://via.placeholder.com/120x40?text=Logoipsum"} alt="Logo"/>
            </div>

            {/* <!-- Links --> */}
            <div className="footer-links">
                <div className="footer-column">
                    <h4>About Us</h4>
                    <ul>
                        <li><a href="#">Company Overview</a></li>
                        <li><a href="#">Our Mission & Values</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Press Releases</a></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Customer Service</h4>
                    <ul>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">FAQs</a></li>
                        <li><a href="#">Live Chat</a></li>
                        <li><a href="#">Cancellation Policy</a></li>
                        <li><a href="#">Booking Policies</a></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Explore</h4>
                    <ul>
                        <li><a href="#">Destinations</a></li>
                        <li><a href="#">Special Offers</a></li>
                        <li><a href="#">Last-Minute Deals</a></li>
                        <li><a href="#">Travel Guides</a></li>
                        <li><a href="#">Blog & Travel Tips</a></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Support</h4>
                    <ul>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms & Conditions</a></li>
                        <li><a href="#">Accessibility</a></li>
                        <li><a href="#">Feedback & Suggestions</a></li>
                        <li><a href="#">Sitemap</a></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Membership</h4>
                    <ul>
                        <li><a href="#">Loyalty Program</a></li>
                        <li><a href="#">Unlock Exclusive Offers</a></li>
                        <li><a href="#">Rewards & Benefits</a></li>
                    </ul>
                </div>
            </div>
        </div>

        <hr/>

        {/* <!-- Bottom Section --> */}
        <div className="footer-bottom">
            <p>© 2024 Ascenda. All rights reserved.</p>
            <div className="footer-socials">
                <Link to="#" className="twitter"><i className="fa-brands fa-twitter"></i></Link>
                <Link to="#" className="linkedin"><i className="fa-brands fa-linkedin"></i></Link>
                <Link to="#" className="whatsapp"><i className="fa-brands fa-whatsapp"></i></Link>
            </div>
        </div>
    </footer>
    );
}
export default Footer;