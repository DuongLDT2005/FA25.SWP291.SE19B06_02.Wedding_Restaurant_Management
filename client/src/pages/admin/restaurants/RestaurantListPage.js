import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormSwitch,
  CFormInput,
  CFormSelect,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import Swal from "sweetalert2";
import { mockUsers } from "../management/users/UserList";

const RestaurantListPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [visibleModal, setVisibleModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const partnerUsers = mockUsers.filter((u) => u.role === "Partner");

    const allRestaurants = partnerUsers.flatMap((partner) =>
      (partner.restaurants || []).map((res, index) => ({
        ...res,
        id: `${partner.id}-${index}`,
        partnerName: partner.name,
        email: partner.email,
        phone: partner.phone,
        partnerId: partner.id,
        // ✅ Thêm ảnh URL cố định để test
        thumbnail:
          res.thumbnail ||
          "https://images.unsplash.com/photo-1555992336-cbf722e1f837?w=800",
        images:
          res.images && res.images.length > 0
            ? res.images
            : [
                "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
                "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
                "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800",
              ],
        description:
          res.description ||
          "A beautiful wedding restaurant with multiple halls and delicious dishes.",
        halls: ["Hall A - 300 guests", "Hall B - 500 guests"],
        menu: ["Set A - Vietnamese", "Set B - European"],
        dishes: ["Grilled chicken", "Beef steak", "Spring rolls"],
      }))
    );

    setRestaurants(allRestaurants);
  }, []);

  const toggleActive = (id) => {
    const restaurant = restaurants.find((r) => r.id === id);
    Swal.fire({
      title:
        restaurant.status === "Active"
          ? "Deactivate this restaurant?"
          : "Activate this restaurant?",
      text: `Are you sure you want to ${
        restaurant.status === "Active" ? "deactivate" : "activate"
      } ${restaurant.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        setRestaurants((prev) =>
          prev.map((r) =>
            r.id === id
              ? { ...r, status: r.status === "Active" ? "Inactive" : "Active" }
              : r
          )
        );
        Swal.fire("Updated!", "Restaurant status has been updated.", "success");
      }
    });
  };

  // Lọc
  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch = r.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Xem chi tiết
  const handleView = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setSelectedImage(restaurant.thumbnail);
    setVisibleModal(true);
  };

  // Đóng modal khi ấn ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setVisibleModal(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <strong>Restaurant Management (by Partner)</strong>
          <div className="d-flex gap-2">
            <CFormInput
              type="text"
              placeholder="Search by restaurant name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "250px" }}
            />
            <CFormSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: "150px" }}
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </CFormSelect>
          </div>
        </CCardHeader>

        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Restaurant</CTableHeaderCell>
                <CTableHeaderCell>Partner</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Phone</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredRestaurants.length > 0 ? (
                filteredRestaurants.map((r, index) => (
                  <CTableRow key={r.id}>
                    <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                    <CTableDataCell>
                      <strong>{r.name}</strong>
                      <br />
                      <small className="text-muted">{r.location}</small>
                    </CTableDataCell>
                    <CTableDataCell>{r.partnerName}</CTableDataCell>
                    <CTableDataCell>{r.email}</CTableDataCell>
                    <CTableDataCell>{r.phone}</CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex align-items-center gap-2">
                        <CFormSwitch
                          color={r.status === "Active" ? "success" : "danger"}
                          checked={r.status === "Active"}
                          onChange={() => toggleActive(r.id)}
                        />
                        <span
                          className={`fw-semibold ${
                            r.status === "Active"
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton color="info" size="sm" onClick={() => handleView(r)}>
                        View
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="7" className="text-center text-muted">
                    No restaurants found.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Modal Chi tiết */}
      <CModal
        visible={visibleModal}
        onClose={() => setVisibleModal(false)}
        size="lg"
        alignment="center"
        backdrop="static"
      >
        {selectedRestaurant && (
          <>
            <CModalHeader>
              <CModalTitle>{selectedRestaurant.name}</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {/* Ảnh chính */}
              <div className="text-center mb-3">
                <img
                  src={selectedImage}
                  alt="Main"
                  style={{
                    maxHeight: "400px",
                    maxWidth: "100%",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              </div>

              {/* Gallery ảnh nhỏ */}
              <div className="d-flex justify-content-center gap-2 mb-4 flex-wrap">
                {[selectedRestaurant.thumbnail, ...selectedRestaurant.images].map(
                  (img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`thumb-${idx}`}
                      onClick={() => setSelectedImage(img)}
                      style={{
                        width: "100px",
                        height: "70px",
                        objectFit: "cover",
                        cursor: "pointer",
                        border:
                          selectedImage === img
                            ? "2px solid #0d6efd"
                            : "1px solid #ccc",
                        borderRadius: "5px",
                      }}
                    />
                  )
                )}
              </div>

              {/* Thông tin chi tiết */}
              <div>
                <p>
                  <strong>Location:</strong> {selectedRestaurant.location}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      selectedRestaurant.status === "Active"
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    {selectedRestaurant.status}
                  </span>
                </p>
                <p>
                  <strong>Partner:</strong> {selectedRestaurant.partnerName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedRestaurant.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedRestaurant.phone}
                </p>
                <p>
                  <strong>Description:</strong> {selectedRestaurant.description}
                </p>
                <p>
                  <strong>Halls:</strong> {selectedRestaurant.halls.join(", ")}
                </p>
                <p>
                  <strong>Menu:</strong> {selectedRestaurant.menu.join(", ")}
                </p>
                <p>
                  <strong>Dishes:</strong> {selectedRestaurant.dishes.join(", ")}
                </p>
              </div>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setVisibleModal(false)}>
                Close
              </CButton>
            </CModalFooter>
          </>
        )}
      </CModal>
    </>
  );
};

export default RestaurantListPage;
