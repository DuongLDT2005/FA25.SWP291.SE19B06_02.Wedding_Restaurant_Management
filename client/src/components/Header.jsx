import React, { useState, useEffect } from "react";
import "../styles/HeaderStyles.css"
import { Link } from "react-router-dom";

function Header() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 150);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (

        <div className={`navbar--header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="navbar--header--left">
                <h2>BRAND LOGO</h2>
            </div>
            <div className="button--header">
                <button><Link to="/signup/owner">Bạn Muốn Hợp Tác?</Link></button>
                <button><Link to="/signup/customer">Đăng Ký</Link></button>
                <button><Link to="/login">Đăng Nhập</Link></button>
            </div>
        </div>
    );
}
export default Header;