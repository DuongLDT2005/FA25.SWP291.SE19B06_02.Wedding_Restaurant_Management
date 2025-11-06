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
} from "@coreui/react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { mockUsers } from "../management/users/UserList";

import { initialRestaurants } from "../../partner/restaurant/RestaurantListPage";

const RestaurantListPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    const partnerUsers = mockUsers.filter((u) => u.role === "Partner");

    let idCounter = 1;

    const allRestaurants = partnerUsers.flatMap((partner) =>
      (partner.restaurants || []).map((res) => ({
        ...res,
        id: idCounter++,
        partnerName: partner.name,
        email: partner.email,
        phone: partner.phone,
        partnerId: partner.id,
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
        status: res.status || "Active",
        location: res.location || "Ho Chi Minh City",
      }))
    );

    setRestaurants(allRestaurants);
    initialRestaurants.splice(0, initialRestaurants.length, ...allRestaurants);
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

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch = r.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleView = (restaurant) => {
    navigate(`/admin/restaurants/detail/${restaurant.id}`);
  };

  return (
    <CCard className="mb-4 bg-dark text-light">
      <CCardHeader className="d-flex justify-content-between align-items-center bg-dark text-light border-secondary">
        <strong>Restaurant Management (by Partner)</strong>
        <div className="d-flex gap-2">
          <CFormInput
            type="text"
            placeholder="Search by restaurant name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "250px" }}
            className="bg-secondary text-light border-0"
          />
          <CFormSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: "150px" }}
            className="bg-secondary text-light border-0"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </CFormSelect>
        </div>
      </CCardHeader>

      <CCardBody>
        <CTable hover responsive className="table-dark align-middle mb-0">
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
                          r.status === "Active" ? "text-success" : "text-danger"
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="info"
                      size="sm"
                      onClick={() => handleView(r)}
                    >
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
  );
};

export default RestaurantListPage;
