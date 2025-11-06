// import React, { useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Card,
//   Badge,
// } from "react-bootstrap";

// const BookingForm = ({ restaurantData = {} }) => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     country: "Việt Nam",
//     eventDate: "",
//     eventTime: "",
//     numberOfGuests: "50",
//     eventType: "wedding",
//     hall: "",
//     menu: "",
//     dish: "",
//     service: "",
//     promotion: "",
//     specialRequests: "",
//     paperlessConfirmation: false,
//   });

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (currentStep < 3) {
//       setCurrentStep(currentStep + 1);
//     } else {
//       console.log("Đã gửi đặt bàn:", formData);
//     }
//   };

//   const primaryColor = "#E11D48";
//   const lightBgColor = "#FEE2E7";

//   return (
//     <div
//       style={{
//         backgroundColor: "#f5f5f5",
//         minHeight: "100vh",
//         paddingTop: "20px",
//         paddingBottom: "40px",
//       }}
//     >
//       {/* Tiêu đề - Kéo dài full width */}
//       <Container>
//         <div
//           style={{
//             backgroundColor: "#1f2937",
//             color: "white",
//             padding: "15px 20px",
//             marginBottom: "30px",
//             borderRadius: "8px",
//           }}
//         >
//           <h3 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>
//             Đặt Nhà Hàng
//           </h3>
//         </div>

//         <Row>
//           <Col lg={12}>
//             <Card
//               style={{
//                 border: "none",
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//                 borderRadius: "8px",
//               }}
//             >
//               <Card.Body style={{ padding: "0" }}>
//                 <Row>
//                   {/* Cột trái - Lựa chọn của bạn */}
//                   <Col lg={4} md={5} style={{ borderRight: "1px solid #e5e7eb" }}>
//                     <div style={{ padding: "20px" }}>
//                       <div
//                         style={{
//                           marginBottom: "25px",
//                           borderBottom: "1px solid #e5e7eb",
//                           paddingBottom: "15px",
//                         }}
//                       >
//                         <h6
//                           style={{
//                             fontWeight: "bold",
//                             color: "#6b7280",
//                             textTransform: "uppercase",
//                           }}
//                         >
//                           Lựa chọn của bạn
//                         </h6>
//                         <h5 style={{ fontWeight: "bold" }}>
//                           {restaurantData.name || "Nhà hàng Grand Palace"}
//                         </h5>
//                         <p style={{ color: "#6b7280", fontSize: "13px" }}>
//                           {restaurantData.address ||
//                             "123 Đường Chính, Trung tâm thành phố"}
//                         </p>
//                         <Badge
//                           style={{ backgroundColor: primaryColor, fontSize: "11px" }}
//                         >
//                           ⭐ 4.8 (320 đánh giá)
//                         </Badge>
//                       </div>

//                       <div
//                         style={{
//                           marginBottom: "25px",
//                           borderBottom: "1px solid #e5e7eb",
//                           paddingBottom: "20px",
//                         }}
//                       >
//                         <h6
//                           style={{
//                             fontWeight: "bold",
//                             color: "#6b7280",
//                             textTransform: "uppercase",
//                           }}
//                         >
//                           Thông tin đặt tiệc
//                         </h6>
//                         <p>Ngày: {formData.eventDate || "Chưa chọn"}</p>
//                         <p>Giờ: {formData.eventTime || "Chưa chọn"}</p>
//                         <p>Số khách: {formData.numberOfGuests} người</p>
//                         <p>Sảnh: {formData.hall || "Chưa chọn"}</p>
//                         <p>Thực đơn: {formData.menu || "Chưa chọn"}</p>
//                         <p>Món đặc biệt: {formData.dish || "Chưa chọn"}</p>
//                         <p>Dịch vụ: {formData.service || "Chưa chọn"}</p>
//                         <p>Khuyến mãi: {formData.promotion || "Chưa chọn"}</p>
//                       </div>

//                       <div>
//                         <h6
//                           style={{
//                             fontWeight: "bold",
//                             color: "#6b7280",
//                             textTransform: "uppercase",
//                           }}
//                         >
//                           Tóm tắt giá
//                         </h6>
//                         <div
//                           style={{ display: "flex", justifyContent: "space-between" }}
//                         >
//                           <span>Giá mỗi người</span>
//                           <span>$50</span>
//                         </div>
//                         <div
//                           style={{ display: "flex", justifyContent: "space-between" }}
//                         >
//                           <span>Số lượng khách</span>
//                           <span>x {formData.numberOfGuests}</span>
//                         </div>
//                         <div
//                           style={{
//                             backgroundColor: lightBgColor,
//                             borderRadius: "6px",
//                             padding: "10px 15px",
//                             marginTop: "10px",
//                             textDecoration: "line-through",
//                             display: "flex",
//                             justifyContent: "space-between",
//                           }}
//                         >
//                           <span>Tạm tính</span>
//                           <span>
//                             $
//                             {50 *
//                               Number.parseInt(formData.numberOfGuests || 50) *
//                               1.2}
//                           </span>
//                         </div>
//                         <div
//                           style={{
//                             backgroundColor: lightBgColor,
//                             borderRadius: "6px",
//                             padding: "10px 15px",
//                             marginTop: "10px",
//                             display: "flex",
//                             justifyContent: "space-between",
//                           }}
//                         >
//                           <span>Ưu đãi đặc biệt</span>
//                           <span style={{ color: "green" }}>
//                             -$
//                             {50 *
//                               Number.parseInt(formData.numberOfGuests || 50) *
//                               0.2}
//                           </span>
//                         </div>
//                         <div
//                           style={{
//                             backgroundColor: primaryColor,
//                             color: "white",
//                             borderRadius: "6px",
//                             padding: "15px",
//                             marginTop: "15px",
//                             fontWeight: "bold",
//                             display: "flex",
//                             justifyContent: "space-between",
//                           }}
//                         >
//                           <span>Tổng cộng</span>
//                           <span>
//                             ${50 * Number.parseInt(formData.numberOfGuests || 50)}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </Col>

//                   {/* Cột phải - Các bước và form */}
//                   <Col lg={8} md={7}>
//                     <div style={{ padding: "20px" }}>
//                       {/* Các bước */}
//                       <div className="mb-4">
//                         <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
//                           {[1, 2, 3].map((step) => (
//                             <React.Fragment key={step}>
//                               <div
//                                 style={{
//                                   width: "40px",
//                                   height: "40px",
//                                   borderRadius: "50%",
//                                   backgroundColor:
//                                     step <= currentStep ? primaryColor : "#e5e7eb",
//                                   color: step <= currentStep ? "white" : "#6b7280",
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "center",
//                                   fontWeight: "bold",
//                                   fontSize: "16px",
//                                   cursor: "pointer",
//                                 }}
//                                 onClick={() => step < currentStep && setCurrentStep(step)}
//                               >
//                                 {step}
//                               </div>
//                               {step < 3 && (
//                                 <div
//                                   style={{
//                                     flex: 1,
//                                     height: "2px",
//                                     backgroundColor:
//                                       step < currentStep ? primaryColor : "#e5e7eb",
//                                     maxWidth: "100px",
//                                   }}
//                                 />
//                               )}
//                             </React.Fragment>
//                           ))}
//                         </div>
//                         <div
//                           style={{
//                             display: "flex",
//                             gap: "100px",
//                             marginTop: "12px",
//                             fontSize: "14px",
//                             color: "#6b7280",
//                           }}
//                         >
//                           <span
//                             style={{ color: currentStep >= 1 ? primaryColor : "inherit" }}
//                           >
//                             Chi tiết sự kiện
//                           </span>
//                           <span
//                             style={{ color: currentStep >= 2 ? primaryColor : "inherit" }}
//                           >
//                             Thông tin của bạn
//                           </span>
//                           <span
//                             style={{ color: currentStep >= 3 ? primaryColor : "inherit" }}
//                           >
//                             Xác nhận & Thanh toán
//                           </span>
//                         </div>
//                       </div>

//                       {/* Form */}
//                       <Form onSubmit={handleSubmit}>
//                         {/* Bước 1 */}
//                         {currentStep === 1 && (
//                           <>
//                             <h4 style={{ fontWeight: "bold", marginBottom: "25px" }}>
//                               Chi tiết sự kiện
//                             </h4>

//                             <Row className="mb-3">
//                               <Col md={6}>
//                                 <Form.Label>Loại sự kiện *</Form.Label>
//                                 <Form.Select
//                                   name="eventType"
//                                   value={formData.eventType}
//                                   onChange={handleInputChange}
//                                 >
//                                   <option value="wedding">Tiệc cưới</option>
//                                   <option value="engagement">Lễ đính hôn</option>
//                                   <option value="rehearsal">Tiệc tập dượt</option>
//                                   <option value="reception">Tiệc chiêu đãi</option>
//                                 </Form.Select>
//                               </Col>
//                               <Col md={6}>
//                                 <Form.Label>Số lượng khách *</Form.Label>
//                                 <Form.Control
//                                   type="number"
//                                   name="numberOfGuests"
//                                   value={formData.numberOfGuests}
//                                   onChange={handleInputChange}
//                                   min="1"
//                                 />
//                               </Col>
//                             </Row>

//                             <Form.Group className="mb-3">
//                               <Form.Label>Chọn sảnh *</Form.Label>
//                               <Form.Select
//                                 name="hall"
//                                 value={formData.hall}
//                                 onChange={handleInputChange}
//                               >
//                                 <option value="">Chọn sảnh</option>
//                                 <option value="grand-ballroom">
//                                   Sảnh Grand Ballroom
//                                 </option>
//                                 <option value="crystal-hall">Sảnh Crystal</option>
//                                 <option value="garden-pavilion">Sảnh Garden</option>
//                                 <option value="royal-chamber">Sảnh Royal</option>
//                               </Form.Select>
//                             </Form.Group>

//                             <Row className="mb-3">
//                               <Col md={6}>
//                                 <Form.Label>Ngày tổ chức *</Form.Label>
//                                 <Form.Control
//                                   type="date"
//                                   name="eventDate"
//                                   value={formData.eventDate}
//                                   onChange={handleInputChange}
//                                 />
//                               </Col>
//                               <Col md={6}>
//                                 <Form.Label>Giờ tổ chức *</Form.Label>
//                                 <Form.Control
//                                   type="time"
//                                   name="eventTime"
//                                   value={formData.eventTime}
//                                   onChange={handleInputChange}
//                                 />
//                               </Col>
//                             </Row>

//                             <Row className="mb-3">
//                               <Col md={4}>
//                                 <Form.Label>Thực đơn</Form.Label>
//                                 <Form.Select
//                                   name="menu"
//                                   value={formData.menu}
//                                   onChange={handleInputChange}
//                                 >
//                                   <option value="">Chọn thực đơn</option>
//                                   <option value="menu1">Thực đơn Tiệc Cưới 1</option>
//                                   <option value="menu2">Thực đơn Tiệc Cưới 2</option>
//                                   <option value="menu3">Thực đơn Cao Cấp</option>
//                                 </Form.Select>
//                               </Col>
//                               <Col md={4}>
//                                 <Form.Label>Dịch vụ</Form.Label>
//                                 <Form.Select
//                                   name="service"
//                                   value={formData.service}
//                                   onChange={handleInputChange}
//                                 >
//                                   <option value="">Chọn dịch vụ</option>
//                                   <option value="basic">Trang trí cơ bản</option>
//                                   <option value="premium">Gói cao cấp</option>
//                                   <option value="luxury">Gói sang trọng</option>
//                                 </Form.Select>
//                               </Col>
//                               <Col md={4}>
//                                 <Form.Label>Khuyến mãi</Form.Label>
//                                 <Form.Select
//                                   name="promotion"
//                                   value={formData.promotion}
//                                   onChange={handleInputChange}
//                                 >
//                                   <option value="">Chọn khuyến mãi</option>
//                                   <option value="discount10">
//                                     Giảm 10% tổng hóa đơn
//                                   </option>
//                                   <option value="freecake">Tặng bánh cưới</option>
//                                   <option value="freeservice">
//                                     Miễn phí trang trí sân khấu
//                                   </option>
//                                 </Form.Select>
//                               </Col>
//                             </Row>
//                           </>
//                         )}

//                         {/* Bước 2 */}
//                         {currentStep === 2 && (
//                           <>
//                             <h4 style={{ fontWeight: "bold", marginBottom: "25px" }}>
//                               Thông tin của bạn
//                             </h4>
//                             <Row className="mb-3">
//                               <Col md={6}>
//                                 <Form.Label>Họ *</Form.Label>
//                                 <Form.Control
//                                   type="text"
//                                   name="firstName"
//                                   value={formData.firstName}
//                                   onChange={handleInputChange}
//                                 />
//                               </Col>
//                               <Col md={6}>
//                                 <Form.Label>Tên *</Form.Label>
//                                 <Form.Control
//                                   type="text"
//                                   name="lastName"
//                                   value={formData.lastName}
//                                   onChange={handleInputChange}
//                                 />
//                               </Col>
//                             </Row>
//                             <Form.Group className="mb-3">
//                               <Form.Label>Email *</Form.Label>
//                               <Form.Control
//                                 type="email"
//                                 name="email"
//                                 value={formData.email}
//                                 onChange={handleInputChange}
//                               />
//                             </Form.Group>
//                             <Form.Group className="mb-3">
//                               <Form.Label>Số điện thoại *</Form.Label>
//                               <Form.Control
//                                 type="tel"
//                                 name="phone"
//                                 value={formData.phone}
//                                 onChange={handleInputChange}
//                               />
//                             </Form.Group>
//                           </>
//                         )}

//                         {/* Bước 3 */}
//                         {currentStep === 3 && (
//                           <>
//                             <h4 style={{ fontWeight: "bold", marginBottom: "25px" }}>
//                               Xác nhận & Hoàn tất
//                             </h4>
//                             <p>
//                               <strong>Họ tên:</strong> {formData.firstName}{" "}
//                               {formData.lastName}
//                             </p>
//                             <p>
//                               <strong>Email:</strong> {formData.email}
//                             </p>
//                             <p>
//                               <strong>Ngày:</strong> {formData.eventDate}
//                             </p>
//                             <p>
//                               <strong>Giờ:</strong> {formData.eventTime}
//                             </p>
//                             <p>
//                               <strong>Tổng tiền:</strong> $
//                               {50 * Number.parseInt(formData.numberOfGuests || 50)}
//                             </p>
//                           </>
//                         )}

//                         {/* Nút điều hướng */}
//                         <div
//                           style={{
//                             display: "flex",
//                             justifyContent: "flex-end",
//                             marginTop: "20px",
//                             gap: "10px",
//                           }}
//                         >
//                           {currentStep > 1 && (
//                             <Button
//                               onClick={() => setCurrentStep(currentStep - 1)}
//                               style={{
//                                 backgroundColor: "white",
//                                 color: primaryColor,
//                                 border: `1px solid ${primaryColor}`,
//                               }}
//                             >
//                               Quay lại
//                             </Button>
//                           )}
//                           <Button
//                             type="submit"
//                             style={{ backgroundColor: primaryColor, border: "none" }}
//                           >
//                             {currentStep === 3 ? "Xác nhận đặt tiệc" : "Tiếp tục"}
//                           </Button>
//                         </div>
//                       </Form>
//                     </div>
//                   </Col>
//                 </Row>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default BookingForm;