import React, { useState, useEffect, useRef } from "react";
import "../styles/HeaderStyles.css";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faTags, faUser, faRightFromBracket, faSquare,faList } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faBell, faTags, faUser, faRightFromBracket); // optional; lets you later use by name if desired

function Header() {
    const location = useLocation();
    const [notificationCount, setNotificationCount] = useState(0); // Example
    const [isScrolled, setIsScrolled] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    // Simulate login state. Replace with real auth logic as needed.
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        // Example: check localStorage for token
        return !!localStorage.getItem('token');
    });

    useEffect(() => {
            if (location.pathname === '/') {
                const handleScroll = () => {
                    const scrollTop = window.scrollY;
                    setIsScrolled(scrollTop > 150);
                };
    
                window.addEventListener('scroll', handleScroll);
                return () => window.removeEventListener('scroll', handleScroll);
            } else {
                setIsScrolled(true);
            }
        }, [location.pathname]);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const dropdownRef = useRef(null);
   
    const isHomepage = window.location.pathname === '/';

    return (
        <div className={`navbar--header ${isScrolled ? 'scrolled' : ''} ${location.pathname !== "/" ? "header--compact" : ""}`}>
                    <div className="navbar--header--left">
                        <h2><Link to="/">LifEvent</Link></h2>
            </div>
            <div className="button--header">
                {isLoggedIn ? (
                    <>
                        <button className="notification--btn">
                            <Link to="/notifications" >
                                <FontAwesomeIcon icon={faBell} size="lg" title="Notifications" />
                                {notificationCount > 0 && (
                                <span className="notification--badge">
                                    {notificationCount}
                                </span>
                                )}
                            </Link>
                        </button>
                            <div
                                className="profile--rectangle"
                                ref={dropdownRef}
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <span style={{ textDecoration: 'none', color: '#333' }}>P</span>
                                {showDropdown && (
                                    <div className="dropdown--menu">
                                        <FontAwesomeIcon
                                            icon={faSquare}
                                            className="fa-rotate-45"
                                        />
                                        <button>
                                            <Link to="/customer/profile" className="drop--item"><FontAwesomeIcon icon={faUser} style={{ marginRight: 6 }} />Hồ sơ</Link>
                                        </button>
                                        <button><Link to="/customer/bookings" className="drop--item"><FontAwesomeIcon icon={faList} style={{ marginRight: 6 }} />Danh sách</Link></button>
                                        <button
                                            onClick={() => {
                                                localStorage.removeItem('token');
                                                setIsLoggedIn(false);
                                            }}
                                        >
                                           <Link to="/logout" className="drop--item"> <FontAwesomeIcon icon={faRightFromBracket} style={{ marginRight: 6 }} />Đăng xuất</Link>
                                        </button>
                                    </div>
                                )}
                            </div>
                    </>
                ) : (
                    <>
                        <button><Link to="/signup/owner">Bạn Muốn Hợp Tác?</Link></button>
                        <button><Link to="/signup/customer">Đăng Ký</Link></button>
                        <button><Link to="/login">Đăng Nhập</Link></button>
                    </>
                )}
            </div>
        </div>
    );
}
export default Header;