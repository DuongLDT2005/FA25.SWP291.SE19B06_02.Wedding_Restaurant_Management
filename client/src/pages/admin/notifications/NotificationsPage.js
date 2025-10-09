import React, { useEffect, useState } from "react";
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CAlert,
} from "@coreui/react";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // TODO: Gọi API thật ở đây
    const mockData = [
      { id: 1, message: "📅 Có một booking mới từ khách hàng A", time: "5 phút trước" },
      { id: 2, message: "❌ Khách hàng B đã hủy booking", time: "20 phút trước" },
      { id: 3, message: "✅ Booking #1234 đã được xác nhận", time: "1 giờ trước" },
    ];
    setNotifications(mockData);
  }, []);

  return (
    <CContainer fluid className="mt-4">
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <strong>📢 Trung tâm thông báo</strong>
            </CCardHeader>
            <CCardBody>
              {notifications.length === 0 ? (
                <CAlert color="info">Chưa có thông báo nào.</CAlert>
              ) : (
                notifications.map((n) => (
                  <CAlert key={n.id} color="light" className="d-flex justify-content-between align-items-center mb-2 border">
                    <span>{n.message}</span>
                    <small className="text-muted">{n.time}</small>
                  </CAlert>
                ))
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default NotificationsPage;
