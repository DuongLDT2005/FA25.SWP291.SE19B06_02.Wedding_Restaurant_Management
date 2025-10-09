import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CButton,
  CBadge,
  CListGroup,
  CListGroupItem,
} from "@coreui/react";

const RestaurantDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dữ liệu giả lập — sau này bạn sẽ fetch từ API theo id
  const restaurants = [
    {
      id: 1,
      name: "Sunflower Wedding Hall",
      location: "Hà Nội",
      partner: "Sunflower Catering",
      status: "Active",
      description: "Một nhà hàng sang trọng, chuyên tổ chức tiệc cưới cao cấp.",
      amenities: ["Wifi miễn phí", "Bãi giữ xe", "Decor trang trí"],
      eventTypes: ["Tiệc cưới", "Hội nghị"],
    },
    {
      id: 2,
      name: "Blue Ocean Center",
      location: "Đà Nẵng",
      partner: "Ocean Blue Events",
      status: "Pending",
      description: "Địa điểm gần biển, phù hợp với các sự kiện ngoài trời.",
      amenities: ["Wifi miễn phí", "Bãi giữ xe"],
      eventTypes: ["Team building", "Sinh nhật"],
    },
    {
      id: 3,
      name: "Green Garden",
      location: "TP. Hồ Chí Minh",
      partner: "Green Garden Hall",
      status: "Inactive",
      description: "Không gian xanh mát, thích hợp tổ chức lễ cưới nhỏ.",
      amenities: ["Decor trang trí"],
      eventTypes: ["Tiệc cưới"],
    },
  ];

  const restaurant = restaurants.find((r) => r.id === Number(id));

  if (!restaurant) {
    return (
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Restaurant Details</strong>
        </CCardHeader>
        <CCardBody>
          <p>❌ Không tìm thấy nhà hàng với ID: {id}</p>
          <CButton color="secondary" onClick={() => navigate(-1)}>
            Quay lại
          </CButton>
        </CCardBody>
      </CCard>
    );
  }

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <strong>Restaurant Details — {restaurant.name}</strong>
      </CCardHeader>
      <CCardBody>
        <CRow className="mb-3">
          <CCol sm={6}>
            <p><strong>ID:</strong> {restaurant.id}</p>
            <p><strong>Location:</strong> {restaurant.location}</p>
            <p><strong>Partner:</strong> {restaurant.partner}</p>
          </CCol>
          <CCol sm={6}>
            <p>
              <strong>Status:</strong>{" "}
              <CBadge color={
                restaurant.status === "Active"
                  ? "success"
                  : restaurant.status === "Pending"
                  ? "warning"
                  : "secondary"
              }>
                {restaurant.status}
              </CBadge>
            </p>
            <p><strong>Description:</strong> {restaurant.description}</p>
          </CCol>
        </CRow>

        <CRow>
          <CCol sm={6}>
            <h6>Amenities</h6>
            <CListGroup>
              {restaurant.amenities.map((a, index) => (
                <CListGroupItem key={index}>{a}</CListGroupItem>
              ))}
            </CListGroup>
          </CCol>
          <CCol sm={6}>
            <h6>Event Types</h6>
            <CListGroup>
              {restaurant.eventTypes.map((e, index) => (
                <CListGroupItem key={index}>{e}</CListGroupItem>
              ))}
            </CListGroup>
          </CCol>
        </CRow>

        <div className="mt-4">
          <CButton color="secondary" onClick={() => navigate(-1)}>
            ← Quay lại danh sách
          </CButton>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default RestaurantDetailsPage;
