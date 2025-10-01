import React, { useState, useMemo, useCallback } from "react";
import "../styles/HeaderSearchbarStyles.css"
import { Link } from 'react-router-dom'
// Danh sách địa điểm cố định - di chuyển ra ngoài component
const LOCATIONS = ["Liên Chiểu", "Ngũ Hành Sơn", "Sơn Trà", "Cẩm Lệ", "Thanh Khê"];

function SearchBar() {
    const [show, setShow] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [formData, setFormData] = useState({
        location: "",
        guests: "",
        events: "",
        time: "",
        costs: ""
    });

    const filteredResults = useMemo(() => {
        if (!formData.location.trim()) return [];

        return LOCATIONS
            .filter(location =>
                location.toLowerCase().includes(formData.location.toLowerCase())
            )
            .slice(0, 8);
    }, [formData.location]);

    const handleLocationChange = useCallback((e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, location: value }));
        setSelectedIndex(-1);
        setShow(value.trim().length > 0);
    }, []);

    const handleKeyDown = useCallback((e) => {
        if (!show || filteredResults.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < filteredResults.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < filteredResults.length) {
                    setFormData(prev => ({ ...prev, location: filteredResults[selectedIndex] }));
                    setShow(false);
                    setSelectedIndex(-1);
                }
                break;
            case 'Escape':
                setShow(false);
                setSelectedIndex(-1);
                break;
            default:
                // Không làm gì với các phím khác
                break;
        }
    }, [show, filteredResults, selectedIndex]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
    }, [formData]);

    const handleLocationSelect = useCallback((location) => {
        setFormData(prev => ({ ...prev, location }));
        setShow(false);
        setSelectedIndex(-1);
    }, []);

    const handleFocus = useCallback(() => {
        if (formData.location && formData.location.trim()) {
            setShow(true);
        }
    }, [formData.location]);

    const handleBlur = useCallback(() => {
        setTimeout(() => setShow(false), 200);
    }, []);
    return (
        <>
            <div>
                <div className="header--image"><img src="/assets/img/wedding_main.jpg" alt="wedding" /></div>
                <div className="header--text">
                    <h1>Chase elegance. Reserve your dream stay now.</h1>
                    <p>Discover the finest ... from all over the world.</p>
                </div>
            </div>
            <form className="header--searchbar" onSubmit={handleSubmit}>
                <div className="option--field">
                    <i className="fa-solid fa-location-dot"></i>
                    <div>
                        <label htmlFor="location">Địa điểm </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            placeholder="Nhập địa điểm..."
                            value={formData.location}
                            onChange={handleLocationChange}
                            onKeyDown={handleKeyDown}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                            autoComplete="off"
                        />
                        {show && filteredResults.length > 0 && (
                            <ul className="search-dropdown">
                                {filteredResults.map((location, i) => {
                                    const inputValue = formData.location.toLowerCase();
                                    const locationLower = location.toLowerCase();
                                    const matchIndex = locationLower.indexOf(inputValue);

                                    return (
                                        <li
                                            key={`${location}-${i}`}
                                            className={`dropdown-item ${i === selectedIndex ? 'selected' : ''}`}
                                            onMouseDown={() => handleLocationSelect(location)}
                                            onMouseEnter={() => setSelectedIndex(i)}
                                        >
                                            {matchIndex !== -1 ? (
                                                <>
                                                    {location.substring(0, matchIndex)}
                                                    <strong>{location.substring(matchIndex, matchIndex + inputValue.length)}</strong>
                                                    {location.substring(matchIndex + inputValue.length)}
                                                </>
                                            ) : (
                                                location
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="option--field">
                    <i className="fa-solid fa-calendar"></i>
                    <div>
                        <label htmlFor="guests">Số lượng khách</label>
                        <select type="number" id="guests" name="guests" value={formData.guests} onChange={handleInputChange}>
                            <option value="">Chọn số lượng</option>
                            <option value="50-100">50 - 100</option>
                            <option value="100-200">100 - 200</option>
                            <option value="200-500">200 - 500</option>
                            <option value="500+">Trên 500</option>
                        </select>
                    </div>
                </div>
                <div className="option--field">
                    <i className="fa-solid fa-calendar"></i>
                    <div>
                        <label htmlFor="events">Ngày sự kiện event</label>
                        <input type="date" id="events" name="events" placeholder="Chọn ngày" value={formData.events} onChange={handleInputChange} />
                    </div>
                </div>
                <div className="option--field">
                    <i className="fa-solid fa-clock"></i>
                    <div>
                        <label htmlFor="time">Khung giờ</label>
                        <select type="text" id="time" name="time" placeholder="Chọn khung giờ" value={formData.time} onChange={handleInputChange}>
                            <option value="">Chọn khung giờ</option>
                            <option value="trua">Trưa (11h - 13h)</option>
                            <option value="toi">Tối (xxh - xxh)</option>
                        </select>
                    </div>
                </div>
                <div className="option--field">
                    <i className="fa-solid fa-dollar-sign"></i>
                    <div>
                        <label htmlFor="costs">Chi phí</label>
                        <select type="text" id="costs" name="costs" value={formData.costs} onChange={handleInputChange} >
                            <option value="">Chọn số lượng</option>
                            <option value="100-200">100 - 200 người</option>
                            <option value="200-300">200 - 300 người</option>
                            <option value="300-400">300 - 400 người</option>
                            <option value="400-500">400 - 500 người</option>
                            <option value="500+">Trên 500 người</option>
                        </select>
                    </div>
                </div>
                <div className="option--field">
                    <Link to="/restaurant/detail" state={{ location: formData.location }}>
                        <button type="submit"><i class="fa-solid fa-magnifying-glass"></i></button>
                    </Link>
                </div>
            </form >
        </>

    );
}
export default SearchBar;