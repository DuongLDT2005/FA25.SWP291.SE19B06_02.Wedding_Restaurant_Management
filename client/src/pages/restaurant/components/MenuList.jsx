// File: MenuList.jsx
import React from "react";

const MenuList = ({ restaurant, role = "CUSTOMER" }) => {
  return (
    <div>
      <h4 className="section-title mb-3">Danh sách thực đơn</h4>

      <div className="row">
        {restaurant.menus?.map((menu) => (
          <div key={menu.id} className="col-md-3 mb-3">
            {/* Card menu */}
            <div
              className="card menu text-white h-100"
              style={{ backgroundColor: "#993344", cursor: "pointer", borderRadius: "12px" }}
              data-bs-toggle="modal"
              data-bs-target={`#menuModal-${menu.id}`}
            >
              <div className="card-body text-center p-3">
                <h6 className="card-title fw-bold mb-2">{menu.name}</h6>
                <p className="mb-0">
                  <small>
                    Giá: <strong>{menu.price?.toLocaleString?.() ?? menu.price} VND/ bàn</strong>
                  </small>
                </p>
              </div>
            </div>

            {/* RESTAURANT_PARTNER/Admin controls */}
            {(role === "RESTAURANT_PARTNER" || role === "ADMIN") && (
              <div className="d-flex justify-content-between mt-2">
                <button className="btn btn-sm btn-outline-primary">Sửa menu</button>
                <button className="btn btn-sm btn-outline-danger">Xóa menu</button>
              </div>
            )}

            {/* Modal */}
            <div
              className="modal fade"
              id={`menuModal-${menu.id}`}
              tabIndex="-1"
              aria-labelledby={`menuModalLabel-${menu.id}`}
              aria-hidden="true"
            >
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header" style={{ background: "#993344", color: "white" }}>
                    <h5 className="modal-title" id={`menuModalLabel-${menu.id}`}>
                      {menu.name} – {menu.price?.toLocaleString?.() ?? menu.price} đ
                    </h5>
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                  </div>

                  <div className="modal-body">
                    {menu.categories?.map((category) => (
                      <div key={category.name} className="mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 style={{ fontWeight: "bold", color: "#993344" }}>
                            {category.name}
                            {category.requiredQuantity && (
                              <small className="text-muted"> (chọn {category.requiredQuantity})</small>
                            )}
                          </h6>

                          {(role === "RESTAURANT_PARTNER" || role === "ADMIN") && (
                            <div>
                              <button className="btn btn-sm btn-outline-primary me-1">Sửa category</button>
                              <button className="btn btn-sm btn-outline-danger">Xóa category</button>
                            </div>
                          )}
                        </div>

                        <table className="table table-bordered text-center align-middle mt-2">
                          <thead className="table-light">
                            <tr>
                              <th style={{ width: "10%" }}>#</th>
                              <th style={{ width: "90%" }}>Tên món</th>
                              {(role === "RESTAURANT_PARTNER" || role === "ADMIN") && <th>Hành động</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {category.dishes?.map((dish, idx) => (
                              <tr key={dish.id}>
                                <td>{idx + 1}</td>
                                <td>{dish.name}</td>
                                {(role === "RESTAURANT_PARTNER" || role === "ADMIN") && (
                                  <td>
                                    <button className="btn btn-sm btn-outline-primary me-1">Sửa</button>
                                    <button className="btn btn-sm btn-outline-danger">Xóa</button>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {(role === "RESTAURANT_PARTNER" || role === "ADMIN") && (
                          <button className="btn btn-sm btn-success mt-2">Thêm món mới</button>
                        )}
                      </div>
                    ))}

                    {(role === "RESTAURANT_PARTNER" || role === "ADMIN") && (
                      <button className="btn btn-sm btn-success mt-3">Thêm category mới</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {(role === "RESTAURANT_PARTNER" || role === "ADMIN") && (
          <div className="col-md-4 mb-3">
            <button
              className="btn btn-lg btn-success w-100 h-100"
              data-bs-toggle="modal"
              data-bs-target="#addMenuModal"
            >
              + Thêm menu mới
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuList;