import React from "react";
import "../styles/HeaderStyles.css"
import { Link } from "react-router-dom";
function SearchBar() {
    return (
        <div className="header--searchbar">
            <div className="option--field">
                <i className="fa-solid fa-location-dot"></i>
                <div>
                    <label htmlFor="location">Where are you headed?</label>
                    <input type="text" id="location" name="location" placeholder="Where are you going?" />
                </div>
            </div>
            <div className="option--field">
                <i className="fa-solid fa-calendar"></i>
                <div>
                    <label htmlFor="checkin">Check in</label>
                    <input type="date" id="checkin" name="checkin" placeholder="Choose the day..." />
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
                    <input type="text" id="room" name="room" placeholder="How many?" />
                </div>
            </div>
            <div className="option--field">
                <i className="fa-solid fa-user"></i>
                <div>
                    {/* htmlFor thay cho for */}
                    <label htmlFor="guest">Guests</label>
                    <input type="text" id="guest" name="guest" placeholder="Enter here..." />
                </div>
            </div>
            <div className="option--field">
                <button type="submit">Book now</button>
            </div>
        </div>
    );
}
export default SearchBar;