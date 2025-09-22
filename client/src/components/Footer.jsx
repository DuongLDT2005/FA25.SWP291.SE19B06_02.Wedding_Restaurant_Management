import React from "react";
import "../styles/FooterStyles.css"
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
                        <li><Link to="#">Company Overview</Link></li>
                        <li><Link to="#">Our Mission & Values</Link></li>
                        <li><Link to="#">Careers</Link></li>
                        <li><Link to="#">Blog</Link></li>
                        <li><Link to="#">Press Releases</Link></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Customer Service</h4>
                    <ul>
                        <li><Link to="#">Contact Us</Link></li>
                        <li><Link to="#">FAQs</Link></li>
                        <li><Link to="#">Live Chat</Link></li>
                        <li><Link to="#">Cancellation Policy</Link></li>
                        <li><Link to="#">Booking Policies</Link></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Explore</h4>
                    <ul>
                        <li><Link to="#">Destinations</Link></li>
                        <li><Link to="#">Special Offers</Link></li>
                        <li><Link to="#">Last-Minute Deals</Link></li>
                        <li><Link to="#">Travel Guides</Link></li>
                        <li><Link to="#">Blog & Travel Tips</Link></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Support</h4>
                    <ul>
                        <li><Link to="#">Privacy Policy</Link></li>
                        <li><Link to="#">Terms & Conditions</Link></li>
                        <li><Link to="#">Accessibility</Link></li>
                        <li><Link to="#">Feedback & Suggestions</Link></li>
                        <li><Link to="#">Sitemap</Link></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Membership</h4>
                    <ul>
                        <li><Link to="#">Loyalty Program</Link></li>
                        <li><Link to="#">Unlock Exclusive Offers</Link></li>
                        <li><Link to="#">Rewards & Benefits</Link></li>
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