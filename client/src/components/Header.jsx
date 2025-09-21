import React from "react";
import "../styles/Header.css"
import { Link } from "react-router-dom";
function Header() {
  return (
    <div className="header">
        <div className="navbar--header">
            <div className="navbar--header--left">
                <h2 style={{color: "#fefaf9;"}}>BRAND LOGO</h2>
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
        <div className="header--section">
            <div>
                <div className="header--image"><img src="/assets/img/wedding_main.jpg" alt="wedding"/></div>
                <div className="header--text">
                    <h1>Chase elegance. Reserve your dream stay now.</h1>
                    <p>Discover the finest ... from all over the world.</p>
                </div>
            </div>
            <div className="header--searchbar">
                <div className="option--field">
                    <i className="fa-solid fa-location-dot"></i>
                    <div>
                        <label htmlFor="location">Where are you headed?</label>
                        <input type="text" id="location" name="location" placeholder="Where are you going?"/>
                    </div>
                </div>
                <div className="option--field">
                    <i className="fa-solid fa-calendar"></i>
                    <div>
                        <label htmlFor="checkin">Check in</label>
                        <input type="date" id="checkin" name="checkin" placeholder="Choose the day..."/>
                    </div>
                </div>
                <div className="option--field">
                    <i className="fa-solid fa-calendar"></i>
                    <div>
                        <label htmlFor="checkout">Check out</label>
                        <input type="date" id="checkout" name="checkout" placeholder="Choose the day..." />
                    </div>
                </div>
                <div className="option--field">
                    <i className="fa-solid fa-house"></i>
                    <div>
                        <label htmlFor="room">Room</label>
                        <input type="text" id="room" name="room" placeholder="How many?"/>
                    </div>
                </div>
                <div className="option--field">
                    <i className="fa-solid fa-user"></i>
                    <div>
                        {/* htmlFor thay cho for */}
                        <label htmlFor="guest">Guests</label>
                        <input type="text" id="guest" name="guest" placeholder="Enter here..."/>
                    </div>
                </div>
                <div className="option--field">
                    <button type="submit">Book now</button>
                </div>
            </div>
        </div>
    </div>
  );
}
export default Header;