import React, { useState, useMemo, useCallback } from "react";
import "../styles/HeaderSearchbarStyles.css"
import { Link, useLocation } from 'react-router-dom'
// Danh sách địa điểm cố định - di chuyển ra ngoài component
const LOCATIONS = ["Liên Chiểu", "Ngũ Hành Sơn", "Sơn Trà", "Cẩm Lệ", "Thanh Khê", "Hải Châu"];

function SearchBar() {
    const location = useLocation();
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
        <form className={`header--searchbar ${location.pathname !== "/" ? "searchbar--compact" : ""}`} onSubmit={handleSubmit}>
            <div className="d-flex align-items-stretch w-100">
                {/* Địa điểm */}
                <div className="option--field position-relative flex-fill">
                    <i className="fa-solid fa-location-dot"></i>
                    <div>
                        <label htmlFor="location">Địa điểm</label>
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

                {/* Số lượng khách */}
                <div className="option--field flex-fill">
                    <i className="fa-solid fa-users"></i>
                    <div>
                        <label htmlFor="guests">Số lượng khách</label>
                        <select
                            id="guests"
                            name="guests"
                            value={formData.guests}
                            onChange={handleInputChange}
                        >
                            <option value="">Chọn số lượng</option>
                            <option value="50-100">50 - 100</option>
                            <option value="100-200">100 - 200</option>
                            <option value="200-500">200 - 500</option>
                            <option value="500+">Trên 500</option>
                        </select>
                    </div>
                </div>

                {/* Ngày sự kiện */}
                <div className="option--field flex-fill">
                    <i className="fa-solid fa-calendar"></i>
                    <div>
                        <label htmlFor="events">Ngày sự kiện</label>
                        <input
                            type="date"
                            id="events"
                            name="events"
                            placeholder="Chọn ngày"
                            value={formData.events}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Khung giờ */}
                <div className="option--field flex-fill">
                    <i className="fa-solid fa-clock"></i>
                    <div>
                        <label htmlFor="time">Khung giờ</label>
                        <select
                            id="time"
                            name="time"
                            placeholder="Chọn khung giờ"
                            value={formData.time}
                            onChange={handleInputChange}
                        >
                            <option value="">Chọn khung giờ</option>
                            <option value="trua">Trưa (11h - 13h)</option>
                            <option value="toi">Tối (18h - 22h)</option>
                        </select>
                    </div>
                </div>

                {/* Chi phí */}
                <div className="option--field flex-fill">
                    <i className="fa-solid fa-dollar-sign"></i>
                    <div>
                        <label htmlFor="costs">Chi phí</label>
                        <select
                            id="costs"
                            name="costs"
                            value={formData.costs}
                            onChange={handleInputChange}
                        >
                            <option value="">Chọn mức giá</option>
                            <option value="10M">Dưới 10M</option>
                            <option value="20M">10M - 20M</option>
                            <option value="30M">20M - 30M</option>
                            <option value="50M">30M - 50M</option>
                            <option value="50M+">Trên 50M</option>
                        </select>
                    </div>
                </div>

                {/* Nút tìm kiếm */}
                <div className="option--field d-flex align-items-center justify-content-center" style={{ flex: '0 0 120px' }}>
                    <Link to="/restaurant/detail" state={{ location: formData.location }} className="w-100">
                        <button type="submit" className="w-100 d-flex align-items-center justify-content-center py-1">
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </button>
                    </Link>
                </div>
            </div>
        </form>
    );
}
export default SearchBar;