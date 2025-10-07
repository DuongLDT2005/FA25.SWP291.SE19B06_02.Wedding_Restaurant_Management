import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/ContractForm.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

// Mock helpers (replace with real session/auth & navigation selection)
function getSessionUser() {
  // New unified retrieval from 'token'
  try {
    const raw = localStorage.getItem("token");
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        fullName: parsed.fullName || "Nguyễn Văn A",
        phone: parsed.phone || "0901234567",
        email: parsed.email || "user@example.com",
        token: parsed.token || parsed.accessToken || "testtoken"
      };
    }
  } catch {}
  return {
    fullName: "Nguyễn Văn A",
    phone: "0901234567",
    email: "user@example.com",
    token: "testtoken"
  };
}

// NEW helper: chuẩn hoá menus nếu còn dạng categories
function normalizeMenusIfNeeded(menus = []) {
  return menus.map(m => {
    if (m.categories && Array.isArray(m.categories)) {
      const dishes = m.categories.flatMap(cat =>
        (cat.dishes || []).map(d => ({
          id: String(d.id),
          name: d.name,
          // map tên -> code
          category: (() => {
            const map = {
              "Món khai vị": "APPETIZER",
              "Khai vị": "APPETIZER",
              "Món chính": "MAIN",
              "Tráng miệng": "DESSERT"
            };
            return map[cat.name] || "MAIN";
          })()
        }))
      );
      return {
        id: m.id,
        name: m.name,
        price: m.price,
        dishes
      };
    }
    return m;
  });
}

function getSelectedRestaurant() {
  const raw = sessionStorage.getItem("selectedRestaurant");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      // address có thể là object
      const addr =
        parsed.addressString ||
        parsed.address?.fullAddress ||
        parsed.address?.street ||
        parsed.address ||
        "";
      return {
        ...parsed,
        address: addr,
        menus: normalizeMenusIfNeeded(parsed.menus || []),
        halls: parsed.halls || [],
        services: parsed.services || []
      };
    } catch {}
  }
  // Fallback demo data (giữ nguyên)
  return {
    id: 101,
    name: "Golden Palace",
    address: "12 Nguyễn Trãi, Hà Nội",
    halls: [
      { id: "H1", name: "Sảnh Ruby", capacity: 250 },
      { id: "H2", name: "Sảnh Diamond", capacity: 350 },
      { id: "H3", name: "Sảnh Emerald", capacity: 180 }
    ],
    menus: [
      {
        id: 1,
        name: "Menu Tiệc Cưới A",
        price: 3500000,
        dishes: [
          { id: "D1", name: "Gỏi ngó sen tôm thịt", category: "APPETIZER" },
          { id: "D2", name: "Súp hải sản", category: "APPETIZER" },
          { id: "D3", name: "Tôm càng hấp nước dừa", category: "MAIN" },
          { id: "D11", name: "Cá tầm sốt chanh dây", category: "MAIN" },
          { id: "D21", name: "Chè hạt sen long nhãn", category: "DESSERT" }
        ]
      },
      {
        id: 2,
        name: "Menu Tiệc Cưới B",
        price: 4200000,
        dishes: [
          { id: "D4", name: "Salad cá ngừ", category: "APPETIZER" },
          { id: "D5", name: "Bò sốt tiêu đen", category: "MAIN" },
          { id: "D6", name: "Lẩu hải sản", category: "MAIN" },
          { id: "D22", name: "Bánh flan caramel", category: "DESSERT" }
        ]
      },
      {
        id: 3,
        name: "Menu Công Ty Premium",
        price: 2800000,
        dishes: [
          { id: "D7", name: "Chả giò hải sản", category: "APPETIZER" },
          { id: "D8", name: "Ức vịt áp chảo", category: "MAIN" },
          { id: "D23", name: "Trái cây tổng hợp", category: "DESSERT" }
        ]
      },
      {
        id: 4,
        name: "Menu Hội Nghị Standard",
        price: 1800000,
        dishes: [
          { id: "D9", name: "Bánh mì bơ tỏi", category: "APPETIZER" },
          { id: "D10", name: "Gà hấp lá chanh", category: "MAIN" },
          { id: "D24", name: "Bánh su kem", category: "DESSERT" }
        ]
      }
    ],
    services: [
      { code: "DECOR_BASIC", label: "Trang trí cơ bản" },
      { code: "DECOR_PREMIUM", label: "Trang trí cao cấp" },
      { code: "MC", label: "MC Chuyên nghiệp" },
      { code: "SOUND_LIGHT", label: "Âm thanh & Ánh sáng" },
      { code: "PHOTO_VIDEO", label: "Chụp ảnh & Quay phim" }
    ]
  };
}

// Required dish counts per category
const REQUIRED_DISH_QUANTITY = {
  APPETIZER: 1,
  MAIN: 2,
  DESSERT: 1
};

const CATEGORY_LABELS = {
  APPETIZER: "Khai vị",
  MAIN: "Món chính",
  DESSERT: "Tráng miệng"
};

const USAGE_TYPES = [
  { value: "WEDDING", label: "Tiệc cưới" },
  { value: "COMPANY", label: "Tiệc công ty" },
  { value: "CONFERENCE", label: "Hội nghị" },
  { value: "EVENT", label: "Sự kiện" }
];

// NEW: predefined time sessions
const EVENT_TIME_OPTIONS = [
  { value: "NOON", label: "Buổi trưa (11:00 - 13:00)" },
  { value: "AFTERNOON", label: "Buổi chiều (14:00 - 17:00)" },
  { value: "EVENING", label: "Buổi tối (18:00 - 21:00)" }
];

function BookingForm({ restaurant: propRestaurant }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(getSessionUser());
  const [restaurant, setRestaurant] = useState(propRestaurant || getSelectedRestaurant());
  const [form, setForm] = useState({
    usageType: "",
    hallId: "",
    serviceCodes: [],
    menuIds: [],
    dishIds: [],
    eventDate: "",
    eventTime: "",        // NEW
    tables: "",
    note: ""
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showDishPicker, setShowDishPicker] = useState(false); // NEW

  useEffect(() => {
    // Sync if props change
    if (propRestaurant) setRestaurant(propRestaurant);
  }, [propRestaurant]);

  // Auto select hall (from session or first available)
  useEffect(() => {
    if (restaurant?.halls?.length && !form.hallId) {
      const stored = sessionStorage.getItem("selectedHallId");
      const hall = stored && restaurant.halls.some(h => h.id === stored)
        ? stored
        : restaurant.halls[0].id;
      setForm(f => ({ ...f, hallId: hall }));
      sessionStorage.setItem("selectedHallId", hall);
    }
  }, [restaurant, form.hallId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }
  function handleUserChange(e) {
    const { name, value } = e.target;
    setUser(u => ({ ...u, [name]: value }));
  }
  function handleMultiSelect(e, key) {
    const opts = Array.from(e.target.selectedOptions).map(o => o.value);
    setForm(f => ({ ...f, [key]: opts }));
    if (key === "menuIds") {
      if (opts.length) {
        // reset món không hợp lệ & mở popup
        setForm(f => ({ ...f, dishIds: f.dishIds.filter(id => {
          return restaurant.menus
            .filter(m => opts.includes(String(m.id)))
            .some(m => (m.dishes || []).some(d => d.id === id));
        }) }));
        setShowDishPicker(true);
      } else {
        setForm(f => ({ ...f, dishIds: [] }));
      }
    }
  }

  const availableDishes = useMemo(() => {
    if (!form.menuIds.length) return [];
    return restaurant.menus
      ?.filter(m => form.menuIds.includes(String(m.id)))
      .flatMap(m => m.dishes || []);
  }, [restaurant.menus, form.menuIds]);
   // NEW: Selected menu names for popup header
  const selectedMenuNames = useMemo(() => {
    return form.menuIds
      .map(id =>
        restaurant.menus.find(m => String(m.id) === String(id))?.name
      )
      .filter(Boolean);
  }, [form.menuIds, restaurant.menus]);
  // Keep selected dishIds only if still available after menu change
  useEffect(() => {
    setForm(f => ({
      ...f,
      dishIds: f.dishIds.filter(id => availableDishes.some(d => d.id === id))
    }));
  }, [availableDishes]);

  // Build grouped dishes
  const dishesByCategory = useMemo(() => {
    const groups = { APPETIZER: [], MAIN: [], DESSERT: [] };
    availableDishes.forEach(d => {
      if (groups[d.category]) groups[d.category].push(d);
    });
    return groups;
  }, [availableDishes]);

  function handleDishToggle(dish) {
    setForm(f => {
      const selected = new Set(f.dishIds);
      const cat = dish.category;
      const catSelected = Array.from(selected).filter(id => {
        const d = availableDishes.find(x => x.id === id);
        return d?.category === cat;
      });
      const required = REQUIRED_DISH_QUANTITY[cat];
      const already = selected.has(dish.id);
      // Toggle logic with constraint
      if (already) {
        selected.delete(dish.id);
      } else {
        if (catSelected.length >= required) {
          return f; // ignore (limit reached)
        }
        selected.add(dish.id);
      }
      return { ...f, dishIds: Array.from(selected) };
    });
  }

  function validate() {
    const errs = {};
    if (!form.usageType) errs.usageType = "Chọn mục đích sử dụng";
    if (!form.eventDate) errs.eventDate = "Chọn ngày tổ chức";
    if (!form.eventTime) errs.eventTime = "Chọn giờ tổ chức"; // NEW
    if (!form.tables || Number(form.tables) <= 0) errs.tables = "Số bàn phải > 0";
    if (!form.menuIds.length) errs.menuIds = "Chọn ít nhất 1 menu";
    // Dish category validation (only for categories that have dishes)
    Object.keys(REQUIRED_DISH_QUANTITY).forEach(cat => {
      const required = REQUIRED_DISH_QUANTITY[cat];
      const present = dishesByCategory[cat]?.length > 0;
      if (present) {
        const selectedCount = form.dishIds.filter(id => {
          const d = availableDishes.find(x => x.id === id);
          return d?.category === cat;
        }).length;
        if (selectedCount !== required) {
          errs[`dish_${cat}`] = `Phải chọn đúng ${required} món ${CATEGORY_LABELS[cat].toLowerCase()} (đang ${selectedCount}/${required})`;
        }
      }
    });
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;
    const payload = {
      user,
      restaurantId: restaurant.id,
      ...form,
      tables: Number(form.tables)
    };
    // Update unified token object (preserve existing token if present)
    try {
      const raw = sessionStorage.getItem("token");
      const existing = raw ? JSON.parse(raw) : {};
      sessionStorage.setItem(
        "token",
        JSON.stringify({
          ...existing,
          fullName: user.fullName,
          phone: user.phone,
          email: user.email,
          token: existing.token || user.token || "testtoken"
        })
      );
    } catch {}
    console.log("SUBMIT CONTRACT PAYLOAD:", payload);
    setSubmitted(true);
    // TODO: call API

    // --- Build lightweight booking object for list page ---
    try {
      const selectedMenus = (restaurant.menus || []).filter(m =>
        form.menuIds.includes(String(m.id))
      );
        const pricePerTable = selectedMenus.reduce((sum, m) => sum + (m.price || 0), 0);
      const totalPrice = pricePerTable * Number(form.tables || 0);

      // Build categories with selected dishes for details page
      const categoryCodes = Object.keys(REQUIRED_DISH_QUANTITY); // ['APPETIZER','MAIN','DESSERT']
      const selectedDishes = availableDishes.filter(d => form.dishIds.includes(d.id));
      const categories = categoryCodes
        .map(code => {
          const dishesForCat = selectedDishes
            .filter(d => d.category === code)
            .map(d => ({ id: d.id, name: d.name }));
          if (!dishesForCat.length) return null; // skip empty category
            return {
              name: CATEGORY_LABELS[code] || code,
              requiredQuantity: REQUIRED_DISH_QUANTITY[code] || dishesForCat.length,
              dishes: dishesForCat
            };
        })
        .filter(Boolean);
      const bookingRecord = {
        bookingID: Date.now(), // temp ID
        status: 0, // Pending
        eventDate: form.eventDate,
        startTime: null,
        endTime: null,
        tableCount: Number(form.tables || 0),
        price: totalPrice,
        specialRequest: form.note,
        restaurant: {
          name: restaurant.name,
          address: restaurant.address,
          thumbnailURL: restaurant.thumbnailURL || ""
        },
        hall: restaurant.halls?.find(h => h.id === form.hallId) || null,
        menu: selectedMenus.length ? {
          name: selectedMenus.map(m => m.name).join(", "),
          price: pricePerTable,
          categories
        } : null,
        services: restaurant.services?.filter(s => form.serviceCodes.includes(s.code)) || [],
        createdAt: new Date().toISOString()
      };

      // Persist to sessionStorage list
      const key = "customerBookings";
      const existing = JSON.parse(sessionStorage.getItem(key) || "[]");
      existing.push(bookingRecord);
      sessionStorage.setItem(key, JSON.stringify(existing));

      // Optionally keep a pointer to the latest created booking
      sessionStorage.setItem("lastCreatedBookingID", String(bookingRecord.bookingID));

      // Navigate to booking list page (adjust path if different in your router)
  navigate("/customer/bookings", { state: { justCreated: bookingRecord.bookingID } });
    } catch (err) {
      console.error("Failed to persist booking for list page", err);
    }
  }

  return (
    <>
    <Header />
    <div className="contract-form-wrapper">
      <h2 className="cf-title">Đặt Tiệc / Tạo Hợp Đồng</h2>

      <form className="contract-form" onSubmit={handleSubmit} noValidate>
        {/* User Info */}
        <div className="cf-section">
          <div className="cf-section-header">Thông tin khách hàng</div>
          <div className="cf-grid">
            <div className="cf-field">
              <label>Họ và tên</label>
              <input name="fullName" value={user.fullName} onChange={handleUserChange} />
            </div>
            <div className="cf-field">
              <label>Số điện thoại</label>
              <input name="phone" value={user.phone} onChange={handleUserChange} />
            </div>
            <div className="cf-field">
              <label>Email</label>
              <input name="email" value={user.email} onChange={handleUserChange} />
            </div>
          </div>
          <div className="cf-small-note">
            Bạn có thể chỉnh sửa thông tin trước khi gửi.
          </div>
        </div>

        {/* Restaurant */}
        <div className="cf-section">
          <div className="cf-section-header">Nhà hàng đã chọn</div>
          <div className="cf-restaurant-card">
            <div className="cf-restaurant-name">{restaurant.name}</div>
            <div className="cf-restaurant-address">{restaurant.address}</div>
            <div className="cf-tag-row">
              {form.hallId && (
                <span className="cf-tag">
                  Sảnh: {
                    restaurant.halls?.find(h => h.id === form.hallId)?.name
                  } (≤ {
                    restaurant.halls?.find(h => h.id === form.hallId)?.capacity
                  } khách)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Usage & Menus */}
        <div className="cf-section">
          <div className="cf-section-header">Thông tin dịch vụ</div>
          <div className="cf-grid">
            <div className="cf-field">
              <label>Mục đích sử dụng<span className="cf-required">*</span></label>
              <select
                name="usageType"
                value={form.usageType}
                onChange={handleChange}
                className={errors.usageType ? "cf-invalid" : ""}
              >
                <option value="">-- Chọn --</option>
                {USAGE_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              {errors.usageType && <div className="cf-error">{errors.usageType}</div>}
            </div>

            <div className="cf-field">
              <label>Chọn menu (đa chọn)<span className="cf-required">*</span></label>
              <select
                multiple
                value={form.menuIds}
                onChange={(e) => handleMultiSelect(e, "menuIds")}
                className={errors.menuIds ? "cf-invalid" : ""}
              >
                {restaurant.menus?.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} - {m.price.toLocaleString()}đ
                  </option>
                ))}
              </select>
              {errors.menuIds && <div className="cf-error">{errors.menuIds}</div>}
              <div className="cf-hint">Giữ Ctrl (Windows) hoặc Cmd (Mac) để chọn nhiều.</div>
            </div>

            <div className="cf-field cf-field-full">
              <label>Món ăn theo danh mục</label>
              {!form.menuIds.length && (
                <div className="cf-hint">Chọn menu trước để chọn món.</div>
              )}
              {!!form.menuIds.length && (
                <div className="cf-dish-edit-row">
                  <button
                    type="button"
                    onClick={() => setShowDishPicker(true)}
                    className="cf-dish-open-btn"
                  >
                    Chọn / Sửa món
                  </button>
                  {Object.keys(CATEGORY_LABELS).map(cat => {
                    if (!dishesByCategory[cat]?.length) return null;
                    const required = REQUIRED_DISH_QUANTITY[cat];
                    const selectedCount = form.dishIds.filter(id => {
                      const d = availableDishes.find(x => x.id === id);
                      return d?.category === cat;
                    }).length;
                    const badgeCls = selectedCount === required ? "ok" : "warn";
                    return (
                      <span
                        key={cat}
                        className={`cf-dish-summary-badge ${badgeCls}`}
                      >
                        {CATEGORY_LABELS[cat]} {selectedCount}/{required}
                      </span>
                    );
                  })}
                </div>
              )}
              {Object.keys(REQUIRED_DISH_QUANTITY).map(cat =>
                errors[`dish_${cat}`] ? (
                  <div key={cat} className="cf-error cf-error-mt4">
                    {errors[`dish_${cat}`]}
                  </div>
                ) : null
              )}
              <div className="cf-hint">
                Nhấn "Chọn / Sửa món" để chọn đủ số lượng mỗi danh mục.
              </div>
            </div>

            <div className="cf-field">
              <label>Dịch vụ thêm</label>
              <select
                multiple
                value={form.serviceCodes}
                onChange={(e) => handleMultiSelect(e, "serviceCodes")}
              >
                {restaurant.services?.map(s => (
                  <option key={s.code} value={s.code}>{s.label}</option>
                ))}
              </select>
              <div className="cf-hint">Không bắt buộc.</div>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="cf-section">
          <div className="cf-section-header">Chi tiết buổi tiệc</div>
          <div className="cf-grid">
            <div className="cf-field">
              <label>Ngày tổ chức<span className="cf-required">*</span></label>
              <input
                type="date"
                name="eventDate"
                value={form.eventDate}
                onChange={handleChange}
                className={errors.eventDate ? "cf-invalid" : ""}
              />
              {errors.eventDate && <div className="cf-error">{errors.eventDate}</div>}
            </div>
            <div className="cf-field">
              <label>Giờ tổ chức<span className="cf-required">*</span></label>
              <select
                name="eventTime"
                value={form.eventTime}
                onChange={handleChange}
                className={errors.eventTime ? "cf-invalid" : ""}
              >
                <option value="">-- Chọn buổi --</option>
                {EVENT_TIME_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              {errors.eventTime && <div className="cf-error">{errors.eventTime}</div>}
            </div>
            <div className="cf-field">
              <label>Số bàn dự kiến<span className="cf-required">*</span></label>
              <input
                type="number"
                name="tables"
                min="1"
                value={form.tables}
                onChange={handleChange}
                className={errors.tables ? "cf-invalid" : ""}
                placeholder="VD: 30"
              />
              {errors.tables && <div className="cf-error">{errors.tables}</div>}
            </div>
            <div className="cf-field cf-field-full">
              <label>Lời nhắn / Yêu cầu</label>
              <textarea
                name="note"
                rows={4}
                value={form.note}
                onChange={handleChange}
                placeholder="Ví dụ: Yêu cầu trang trí tone trắng - vàng, bố trí sân khấu LED..."
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="cf-section">
          <div className="cf-summary">
            <div>
              <strong>Sảnh:</strong>{" "}
              {form.hallId
                ? restaurant.halls?.find(h => h.id === form.hallId)?.name
                : "Chưa chọn"}
            </div>
            <div>
              <strong>Menus đã chọn:</strong>{" "}
              {form.menuIds.length
                ? form.menuIds
                    .map(id => restaurant.menus.find(m => String(m.id) === String(id))?.name)
                    .filter(Boolean)
                    .join(", ")
                : "Chưa chọn"}
            </div>
            <div>
              <strong>Món đã chọn:</strong>{" "}
              {form.dishIds.length
                ? Object.keys(CATEGORY_LABELS).map(cat => {
                    const names = form.dishIds
                      .map(id => {
                        const d = availableDishes.find(x => x.id === id && x.category === cat);
                        return d ? d.name : null;
                      })
                      .filter(Boolean);
                    if (!names.length) return null;
                    return `${CATEGORY_LABELS[cat]}: ${names.join(", ")}`;
                  }).filter(Boolean).join(" | ")
                : "Không"}
            </div>
            <div>
              <strong>Dịch vụ thêm:</strong>{" "}
              {form.serviceCodes.length
                ? form.serviceCodes
                    .map(code => restaurant.services.find(s => s.code === code)?.label)
                    .filter(Boolean)
                    .join(", ")
                : "Không"}
            </div>
            <div>
              <strong>Thời gian:</strong>{" "}
              {form.eventDate || form.eventTime
                ? [
                    form.eventDate,
                    EVENT_TIME_OPTIONS.find(o => o.value === form.eventTime)?.label
                  ].filter(Boolean).join(" - ")
                : "Chưa chọn"}
            </div>
          </div>
        </div>

        <div className="cf-actions">
          <button type="submit" className="cf-btn cf-btn-primary">Gửi yêu cầu</button>
          <button
            type="button"
            className="cf-btn cf-btn-secondary"
            onClick={() => {
              setForm({
                usageType: "",
                hallId: "",
                serviceCodes: [],
                menuIds: [],
                dishIds: [],
                eventDate: "",
                eventTime: "",    // RESET
                tables: "",
                note: ""
              });
              setErrors({});
              setSubmitted(false);
            }}
          >
            Làm lại
          </button>
        </div>

        {submitted && !Object.keys(errors).length && (
          <div className="cf-success">Yêu cầu đã được gửi! Vui lòng chờ xác nhận.</div>
        )}
      </form>
      </div>

      {/* POPUP CHỌN MÓN */}
      {showDishPicker && (
        <div className="cf-dish-modal-overlay">
          <div className="cf-dish-modal">
            <div className="cf-dish-modal-header">
              <div className="cf-selected-menus">
                {selectedMenuNames.length > 0 && (
                  <div className="cf-selected-menus-box">
                    Menu đã chọn: {selectedMenuNames.join(", ")}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowDishPicker(false)}
                className="cf-modal-close-btn"
                aria-label="Đóng"
              >
                ×
              </button>
            </div>
            <div className="cf-dish-modal-body">
              {Object.keys(CATEGORY_LABELS).map(cat => {
                const list = dishesByCategory[cat];
                if (!list.length) return null;
                const required = REQUIRED_DISH_QUANTITY[cat];
                const selectedIds = form.dishIds.filter(id => {
                  const d = availableDishes.find(x => x.id === id);
                  return d?.category === cat;
                });
                const full = selectedIds.length >= required;
                const progressCls = selectedIds.length === required ? "ok" : "warn";
                return (
                  <div key={cat} className="cf-dish-cat">
                    <div className="cf-dish-cat-head">
                      <div className="cf-dish-cat-title">
                        {CATEGORY_LABELS[cat]} (chọn {required})
                      </div>
                      <div className={`cf-dish-cat-progress ${progressCls}`}>
                        {selectedIds.length}/{required}
                      </div>
                    </div>
                    <div className="cf-dish-grid">
                      {list.map(d => {
                        const checked = form.dishIds.includes(d.id);
                        const disable = !checked && full;
                        return (
                          <label
                            key={d.id}
                            className={`cf-dish-item ${disable ? "disabled" : ""} ${checked ? "checked" : ""}`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={disable}
                              onChange={() => handleDishToggle(d)}
                            />
                            <span className="cf-dish-name">{d.name}</span>
                          </label>
                        );
                      })}
                    </div>
                    {errors[`dish_${cat}`] && (
                      <div className="cf-error cf-error-mt8">
                        {errors[`dish_${cat}`]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="cf-dish-modal-actions">
              <button
                type="button"
                onClick={() => setShowDishPicker(false)}
                className="cf-dish-close-btn"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  const v = validate();
                  setErrors(v);
                  if (!Object.keys(v).some(k => k.startsWith("dish_"))) {
                    setShowDishPicker(false);
                  }
                }}
                className="cf-confirm-dishes-btn"
              >
                Xác nhận món
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default BookingForm;
