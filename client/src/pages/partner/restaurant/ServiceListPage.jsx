// File: src/pages/partner/Restaurant/ServiceListPage.jsx
import React, { useState } from "react";
import ServiceDetailPage from "./ServiceDetailPage";
import ServiceCreatePage from "./ServiceCreatePage";
import mock from "../../../mock/partnerMock";

export default function ServiceListPage() {
  const [activeService, setActiveService] = useState(null);
  const [creatingService, setCreatingService] = useState(false);
  const [activeEventType, setActiveEventType] = useState(null);

  const [eventTypes, setEventTypes] = useState(mock.eventTypes);
  const [services, setServices] = useState(mock.services);

  // === Thêm loại sự kiện mới ===
  const handleAddEventType = () => {
    const newType = {
      eventTypeID: Date.now(),
      name: "Loại sự kiện mới",
      status: 1,
    };
    setEventTypes([...eventTypes, newType]);
  };

  // === Cập nhật loại sự kiện (tên) ===
  const handleUpdateEventType = (id, field, value) => {
    setEventTypes((prev) =>
      prev.map((t) => (t.eventTypeID === id ? { ...t, [field]: value } : t))
    );
  };

  // === Toggle trạng thái loại sự kiện (luôn confirm) ===
  const handleToggleEventType = (id) => {
    setEventTypes((prev) =>
      prev.map((t) =>
        t.eventTypeID === id ? { ...t, status: t.status === 1 ? 0 : 1 } : t
      )
    );
  };

  // === Thêm dịch vụ mới ===
  const handleAddService = (eventTypeID) => {
    setActiveEventType(eventTypeID);
    setCreatingService(true);
  };

  // === Toggle trạng thái dịch vụ (luôn confirm) ===
  const handleToggleServiceStatus = (id) => {
    setServices((prev) =>
      prev.map((s) =>
        s.serviceID === id ? { ...s, status: s.status === 1 ? 0 : 1 } : s
      )
    );
  };

  return (
    <>
      {creatingService ? (
        <ServiceCreatePage
          eventTypeID={activeEventType}
          onBack={() => setCreatingService(false)}
        />
      ) : activeService ? (
        <ServiceDetailPage
          service={activeService}
          eventTypes={mock.eventTypes}
          onBack={() => setActiveService(null)}
        />
      ) : (
        <div className="p-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Danh sách dịch vụ theo loại sự kiện</h3>
            <button className="btn btn-primary" onClick={handleAddEventType}>
              + Thêm loại sự kiện
            </button>
          </div>

          {eventTypes.map((type) => {
            const servicesByType = services.filter(
              (s) => s.eventTypeID === type.eventTypeID
            );

            return (
              <div
                key={type.eventTypeID}
                className="border rounded-4 p-3 mb-4 bg-light shadow-sm"
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex flex-column">
                    <input
                      type="text"
                      value={type.name}
                      onChange={(e) =>
                        handleUpdateEventType(
                          type.eventTypeID,
                          "name",
                          e.target.value
                        )
                      }
                      className="form-control mb-1 fw-bold"
                      style={{ maxWidth: "250px" }}
                    />

                    {/* Switch loại sự kiện */}
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={type.status === 1}
                        onChange={() => {
                          const confirmMsg =
                            type.status === 1
                              ? "Bạn có chắc chắn muốn ngừng hoạt động loại sự kiện này?"
                              : "Bạn có chắc chắn muốn kích hoạt loại sự kiện này?";
                          if (window.confirm(confirmMsg)) {
                            handleToggleEventType(type.eventTypeID);
                          }
                        }}
                      />
                      <label className="form-check-label">
                        {type.status === 1 ? "Hoạt động" : "Ngừng hoạt động"}
                      </label>
                    </div>
                  </div>

                  <button
                    className="btn btn-success text-white"
                    onClick={() => handleAddService(type.eventTypeID)}
                  >
                    + Thêm dịch vụ
                  </button>
                </div>

                <div className="row">
                  {servicesByType.length > 0 ? (
                    servicesByType.map((s) => (
                      <div
                        key={s.serviceID}
                        className="col-md-4 mb-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => setActiveService(s)}
                      >
                        <div className="card h-100 shadow-sm">
                          <div className="card-body">
                            <h5 className="card-title fw-bold">{s.name}</h5>
                            <p className="card-text mb-1">
                              Giá: {s.price.toLocaleString("vi-VN")} ₫
                            </p>
                            <p className="card-text mb-2">Đơn vị: {s.unit}</p>

                            {/* Switch dịch vụ */}
                            <div
                              className={`badge ${
                                s.status === 1 ? "bg-success" : "bg-secondary"
                              }`}
                              style={{ cursor: "pointer" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                const confirmMsg =
                                  s.status === 1
                                    ? "Bạn có chắc chắn muốn ngừng bán dịch vụ này?"
                                    : "Bạn có chắc chắn muốn kích hoạt dịch vụ này?";
                                if (window.confirm(confirmMsg)) {
                                  handleToggleServiceStatus(s.serviceID);
                                }
                              }}
                            >
                              {s.status === 1 ? "Đang hoạt động" : "Ngừng bán"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted fst-italic">
                      Chưa có dịch vụ nào cho loại này
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}