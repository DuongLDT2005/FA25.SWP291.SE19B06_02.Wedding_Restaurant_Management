import { Container, Row, Col } from "react-bootstrap"
import "../styles/FooterStyles.css"

export default function Footer() {
  return (
    <footer className="footer">
      <Container fluid className="footer-wrapper">
        <Row className="footer-content align-items-center g-5">
          <Col /*lg={3} md={6} sm={12}*/ className="footer-brand-section">
            <div className="brand-logo-wrapper">
              <h2 className="brand-name">LifEvent</h2>
            </div>
          </Col>

          <Col /*lg={4} md={6} sm={12}*/ className="footer-contact-section">
            <h4 className="footer-section-title">LIÊN HỆ</h4>
            <div className="contact-content">
              <p className="contact-item">insert email here</p>
              <div className="divider"></div>
              <p className="contact-item">Đại học FPT</p>
              <p className="contact-item">Đà Nẵng</p>
            </div>
          </Col>

          <Col /*lg={5} md={6} sm={12}*/ className="footer-links-section">
            <ul className="footer-links-list">
              <li>
                <button className="footer-link-btn">VỀ CHÚNG TÔI</button>
              </li>
              <li>
                <button className="footer-link-btn">CHƯƠNG TRÌNH HIỆN TẠI</button>
              </li>
              <li>
                <button className="footer-link-btn">THE HOUSE</button>
              </li>
              <li>
                <button className="footer-link-btn">LOOKING BACK</button>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>

      <div className="footer-bottom">
        <p>© 2025 LifEvent. Tất cả các quyền được bảo lưu.</p>
      </div>
    </footer>
  )
}
