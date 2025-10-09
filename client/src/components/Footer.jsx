
import React from "react";
import "../styles/FooterStyles.css";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-links">
                    <div className="footer-column">
                        <h4>Về Chúng Tôi</h4>
                        <ul>
                            <li><Link to="#">Tổng quan công ty</Link></li>
                            <li><Link to="#">Sứ mệnh & Giá trị</Link></li>
                            <li><Link to="#">Tuyển dụng</Link></li>
                            <li><Link to="#">Blog</Link></li>
                            <li><Link to="#">Thông cáo báo chí</Link></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4>Dịch Vụ Khách Hàng</h4>
                        <ul>
                            <li><Link to="#">Liên hệ</Link></li>
                            <li><Link to="#">Câu hỏi thường gặp</Link></li>
                            <li><Link to="#">Hỗ trợ trực tuyến</Link></li>
                            <li><Link to="#">Chính sách hủy</Link></li>
                            <li><Link to="#">Điều khoản đặt chỗ</Link></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4>Khám Phá</h4>
                        <ul>
                            <li><Link to="#">Điểm đến</Link></li>
                            <li><Link to="#">Ưu đãi đặc biệt</Link></li>
                            <li><Link to="#">Khuyến mãi phút chót</Link></li>
                            <li><Link to="#">Cẩm nang du lịch</Link></li>
                            <li><Link to="#">Mẹo & Blog du lịch</Link></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4>Hỗ Trợ</h4>
                        <ul>
                            <li><Link to="#">Chính sách bảo mật</Link></li>
                            <li><Link to="#">Điều khoản & điều kiện</Link></li>
                            <li><Link to="#">Trợ năng</Link></li>
                            <li><Link to="#">Góp ý & phản hồi</Link></li>
                            <li><Link to="#">Sơ đồ trang</Link></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4>Thành Viên</h4>
                        <ul>
                            <li><Link to="#">Chương trình khách hàng thân thiết</Link></li>
                            <li><Link to="#">Ưu đãi độc quyền</Link></li>
                            <li><Link to="#">Quyền lợi & phần thưởng</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            <hr />

            {/* Phần cuối được chia nhỏ bằng Bootstrap Grid System */}
            {/* Sử dụng container-fluid để tận dụng chiều rộng, d-flex và justify-content-between để căn chỉnh */}
            <div className="container-fluid">
                <div className="row footer-bottom align-items-center">
                    {/* Cột bản quyền, chiếm 6 cột trên màn hình nhỏ trở lên (col-sm-6) */}
                    <div className="col-12 col-sm-6 text-center text-sm-start mb-2 mb-sm-0">
                        <p className="mb-0">© 2024 Ascenda. Bản quyền đã được bảo lưu.</p>
                    </div>

                    {/* Cột mạng xã hội, chiếm 6 cột và căn giữa/căn phải */}
                    <div className="col-12 col-sm-6 text-center text-sm-end">
                        <div className="footer-socials">
                            <Link to="#" className="twitter"><i className="fa-brands fa-x-twitter"></i></Link>
                            <Link to="#" className="linkedin"><i className="fa-brands fa-linkedin-in"></i></Link>
                            <Link to="#" className="facebook"><i className="fa-brands fa-facebook-f"></i></Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;