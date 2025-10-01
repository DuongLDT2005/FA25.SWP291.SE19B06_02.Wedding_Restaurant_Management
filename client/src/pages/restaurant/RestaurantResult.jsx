import React, { useEffect, useState } from "react";
import { CCard, CCardBody, CRow, CCol, CButton, CBadge } from "@coreui/react";
import { fetchRestaurants } from "../../api/RestaurantAPI";

const RestaurantResult = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetchRestaurants("danang").then((data) => setRestaurants(data));
  }, []);

  return (
    <CRow className="g-4">
      {restaurants.map((r) => (
        <CCol xs={12} key={r.restaurantID}>
          <CCard className="shadow-sm">
            <CRow className="g-0">
              <CCol md={4}>
                <img
                  src={r.thumbnailURL}
                  alt={r.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </CCol>
              <CCol md={8}>
                <CCardBody>
                  <h5>{r.name}</h5>
                  <p className="text-muted">{r.address}</p>
                  <p>{r.description}</p>
                  <CBadge color="success">⭐ {r.rating}</CBadge>
                  <p className="fw-bold text-danger">
                    {r.minPrice.toLocaleString()} - {r.maxPrice.toLocaleString()} VND
                  </p>
                  <CButton color="primary">See Availability</CButton>
                </CCardBody>
              </CCol>
            </CRow>
          </CCard>
        </CCol>
      ))}
    </CRow>
  );
};

export default RestaurantResult;
