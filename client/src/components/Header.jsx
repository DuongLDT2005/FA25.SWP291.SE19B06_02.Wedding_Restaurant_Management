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
        <div className="header">
            <div className={`navbar--header ${isScrolled ? 'scrolled' : ''}`}>
                <div className="navbar--header--left">
                    <h2>BRAND LOGO</h2>
                </div>
                <div className="navbar--header--right">
                    <ul>
                        <li><Link to="/">Trang Chủ</Link></li>
                        <li><Link to="">Dịch Vụ</Link></li>
                        <li><Link to="">Đặt Phòng</Link></li>
                        <li><Link to="">Khám Phá</Link></li>
                        <li><Link to="">Hội viên</Link></li>
                        <li><Link to="/signup/owner">Trở Thành Chủ</Link></li>
                    </ul>
                    <div className="button--header">
                        <button id="register">Đăng Ký</button>
                        <button id="signin">Đăng Nhập</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Header;