import React from "react";
import { CCard, CCardBody, CListGroup, CListGroupItem, CBadge } from "@coreui/react";

const UserDetail = ({ user }) => {
  if (!user) return <p>No user selected</p>;

  return (
    <CCard>
      <CCardBody>
        <h5 className="mb-3">{user.name}</h5>
        <CListGroup flush>
          <CListGroupItem>
            <strong>Email:</strong> {user.email}
          </CListGroupItem>
          <CListGroupItem>
            <strong>Phone:</strong> {user.phone}
          </CListGroupItem>
          <CListGroupItem>
            <strong>Role:</strong>{" "}
            <CBadge color={user.role === "Partner" ? "info" : "secondary"}>
              {user.role}
            </CBadge>
          </CListGroupItem>
          <CListGroupItem>
            <strong>Status:</strong>{" "}
            <CBadge color={user.active ? "success" : "secondary"}>
              {user.active ? "Active" : "Inactive"}
            </CBadge>
          </CListGroupItem>
          <CListGroupItem>
            <strong>Created At:</strong> {user.createdAt}
          </CListGroupItem>
        </CListGroup>

        {/* Hiển thị riêng cho Partner */}
        {user.role === "Partner" && (
          <>
            <hr />
            <h6 className="text-primary fw-bold mt-3 mb-2">Owned Restaurants</h6>
            {user.restaurants && user.restaurants.length > 0 ? (
              <CListGroup flush>
                {user.restaurants.map((r, idx) => (
                  <CListGroupItem key={idx}>
                    <strong>{r.name}</strong>
                    <br />
                    <small>{r.location}</small>
                    <br />
                    <CBadge
                      color={r.status === "Active" ? "success" : "secondary"}
                      className="mt-1"
                    >
                      {r.status}
                    </CBadge>
                  </CListGroupItem>
                ))}
              </CListGroup>
            ) : (
              <p>No restaurants found.</p>
            )}
          </>
        )}
      </CCardBody>
    </CCard>
  );
};

export default UserDetail;
