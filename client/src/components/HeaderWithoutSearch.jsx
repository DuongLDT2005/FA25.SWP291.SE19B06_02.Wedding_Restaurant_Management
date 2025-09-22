import React from "react";
import "../styles/HeaderStyles.css"
import { Link } from "react-router-dom";
function HeaderWithoutSearch() {
  return (
    <div className="header">
        <div className="navbar--header">
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
                    <li><Link to="/signUpForOwner">Trở Thành Chủ</Link></li>
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
export default HeaderWithoutSearch;