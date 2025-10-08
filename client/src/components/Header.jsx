import React, { useState, useEffect, useRef } from "react";
import "../styles/HeaderStyles.css";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faTags, faUser, faRightFromBracket, faSquare, faList, faMessage } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faBell, faTags, faUser, faRightFromBracket, faMessage); // optional; lets you later use by name if desired

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
    const [notifications, setNotifications] = useState(() => ([
        {
            id: 1,
            type: "chat",
            title: "Tin nhắn mới",
            preview: "Nhà hàng Golden: Chúng tôi đã nhận được yêu cầu...",
            time: "2 phút trước",
            unread: true
        },
        {
            id: 2,
            type: "promo",
            title: "Khuyến mãi tháng 10",
            preview: "Giảm 15% cho tiệc cưới đặt trước 30 ngày.",
            time: "1 giờ trước",
            unread: true
        },
        {
            id: 3,
            type: "chat",
            title: "Trao đổi",
            preview: "Nhà hàng Silver hỏi thêm thông tin về số bàn.",
            time: "Hôm qua",
            unread: false
        }
    ])); // FIX: was an object, now array
    const [showNotiPanel, setShowNotiPanel] = useState(false);

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
    const dropdownRef = useRef(null);
    const notiRef = useRef(null); // NEW

    // Update unread count whenever notifications change
    useEffect(() => {
        setNotificationCount(
          Array.isArray(notifications)
            ? notifications.filter(n => n.unread).length
            : 0
        );
    }, [notifications]);

    // Click outside to close both dropdowns
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
            if (notiRef.current && !notiRef.current.contains(e.target)) {
                setShowNotiPanel(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function markAllRead() {
        setNotifications(ns =>
          Array.isArray(ns) ? ns.map(n => ({ ...n, unread: false })) : ns
        );
    }
    function toggleNoti() {
        setShowNotiPanel(p => !p);
    }
    function openItem(n) {
        setNotifications(ns =>
          Array.isArray(ns)
            ? ns.map(x => x.id === n.id ? { ...x, unread: false } : x)
            : ns
        );
    }

    return (
        <div className={`navbar--header ${isScrolled ? 'scrolled' : ''} ${location.pathname !== "/" ? "header--compact" : ""}`}>
            <div className="navbar--header--left">
                <h2><Link to="/">LifEvent</Link></h2>
            </div>
            <div className="button--header">
                {isLoggedIn ? (
                    <>
                        {/* NOTIFICATION WRAPPER */}
                        <div className="notification-wrapper" ref={notiRef}>
                            <button
                                className="notification--btn"
                                type="button"
                                aria-label="Thông báo"
                                onClick={toggleNoti}
                            >
                                <FontAwesomeIcon icon={faBell} size="lg" />
                                {notificationCount > 0 && (
                                    <span className="notification--badge">
                                        {notificationCount}
                                    </span>
                                )}
                            </button>
                            {showNotiPanel && (
                                <div className="notification-dropdown">
                                    <div className="noti-header">
                                        <span className="noti-title">Thông báo</span>
                                        {notificationCount > 0 && (
                                            <button
                                                type="button"
                                                className="noti-mark-read"
                                                onClick={markAllRead}
                                            >
                                                Đánh dấu đã đọc
                                            </button>
                                        )}
                                    </div>
                                    <div className="noti-list">
                                        {notifications.map(n => {
                                            const icon = n.type === "chat" ? faMessage : faTags;
                                            return (
                                                <button
                                                    key={n.id}
                                                    className={`noti-item ${n.unread ? 'unread' : ''}`}
                                                    onClick={() => openItem(n)}
                                                >
                                                    <div className={`noti-item-icon ${n.type}`}>
                                                        <FontAwesomeIcon icon={icon} />
                                                    </div>
                                                    <div className="noti-item-body">
                                                        <div className="noti-item-line">
                                                            <span className="noti-item-title">{n.title}</span>
                                                            <span className="noti-item-time">{n.time}</span>
                                                            {n.unread && <span className="noti-item-dot" />}
                                                        </div>
                                                        <div className="noti-item-preview">{n.preview}</div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                        {notifications.length === 0 && (
                                            <div className="noti-empty">Không có thông báo.</div>
                                        )}
                                    </div>
                                    <div className="noti-footer">
                                        <Link
                                            to="/notifications"
                                            className="noti-footer-link"
                                            onClick={() => setShowNotiPanel(false)}
                                        >
                                            Xem tất cả
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* PROFILE DROPDOWN */}                        
                        <div
                            className="profile--rectangle"
                            ref={dropdownRef}
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <span className="profile-initial">P</span>
                            {showDropdown && (
                                <div className="dropdown--menu">
                                    <FontAwesomeIcon
                                        icon={faSquare}
                                        className="fa-rotate-45"
                                    />
                                    <button>
                                        <Link to="/customer/profile" className="drop--item"><FontAwesomeIcon icon={faUser} style={{ marginRight: 6 }} />Hồ sơ</Link>
                                    </button>
                                    <button>
                                        <Link to="/customer/bookings" className="drop--item"><FontAwesomeIcon icon={faList} style={{ marginRight: 6 }} />Danh sách</Link>
                                    </button>
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem('token');
                                            setIsLoggedIn(false);
                                        }}
                                    >
                                        <Link to="/logout" className="drop--item">
                                            <FontAwesomeIcon icon={faRightFromBracket} style={{ marginRight: 6 }} />Đăng xuất
                                        </Link>
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