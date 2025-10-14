import React, { useState } from "react";
import DishDetailPage from "./DishDetailPage";
import DishCreatePage from "./DishCreatePage";
import mock from "../../../mock/partnerMock";

export default function DishListPage() {
  const [activeDish, setActiveDish] = useState(null);
  const [creatingDish, setCreatingDish] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState(mock.dishCategories);
  const [dishes, setDishes] = useState(mock.dish);

  // === Thêm category mới ===
  const handleAddCategory = () => {
    const newCategory = {
      categoryID: Date.now(),
      name: "Loại mới",
      requiredQuantity: 1,
      status: 1, // 1 = active, 0 = inactive
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  // === Cập nhật category (tên hoặc số lượng yêu cầu) ===
  const handleUpdateCategory = (id, field, value) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.categoryID === id ? { ...c, [field]: value } : c
      )
    );
  };

  // === Xóa mềm category (inactive) ===
  const handleToggleCategoryStatus = (id) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.categoryID === id
          ? { ...c, status: c.status === 1 ? 0 : 1 }
          : c
      )
    );
  };

  // === Thêm món mới trong 1 category ===
  const handleAddDish = (categoryID) => {
    setActiveCategory(categoryID);
    setCreatingDish(true);
  };

  // === Toggle trạng thái món ===
  const handleToggleDishStatus = (id) => {
    setDishes((prev) =>
      prev.map((d) =>
        d.dishID === id ? { ...d, status: d.status === 1 ? 0 : 1 } : d
      )
    );
  };

  // === Filter theo category active ===
  const activeCategories = categories.filter((c) => c.status === 1);

  return (
    <>
      {creatingDish ? (
        <DishCreatePage
          categoryID={activeCategory}
          onBack={() => setCreatingDish(false)}
        />
      ) : activeDish ? (
        <DishDetailPage dish={activeDish} onBack={() => setActiveDish(null)} />
      ) : (
        <div className="p-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Danh sách món ăn theo loại</h3>
            <button className="btn btn-primary text-white" onClick={handleAddCategory}>
              + Thêm loại món
            </button>
          </div>

          {/* --- Danh sách Category --- */}
          {categories.map((cat) => {
            const categoryDishes = dishes.filter(
              (d) => d.categoryID === cat.categoryID
            );

            return (
              <div
                key={cat.categoryID}
                className={`border rounded-4 p-3 mb-4 shadow-sm ${
                  cat.status === 0 ? "bg-secondary-subtle" : "bg-light"
                }`}
              >
                {/* --- Header Category --- */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex flex-column">
                    <div className="d-flex align-items-center gap-2">
                      <input
                        type="text"
                        value={cat.name}
                        onChange={(e) =>
                          handleUpdateCategory(cat.categoryID, "name", e.target.value)
                        }
                        className="form-control fw-bold"
                        style={{ width: "250px" }}
                        disabled={cat.status === 0}
                      />
                      <span
                        className={`badge ${
                          cat.status === 1 ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {cat.status === 1 ? "Hoạt động" : "Đã ẩn"}
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-2 mt-2">
                      <label className="mb-0">Số món yêu cầu:</label>
                      <input
                        type="number"
                        value={cat.requiredQuantity}
                        onChange={(e) =>
                          handleUpdateCategory(
                            cat.categoryID,
                            "requiredQuantity",
                            Number(e.target.value)
                          )
                        }
                        className="form-control"
                        style={{ width: "80px" }}
                        disabled={cat.status === 0}
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success text-white"
                      onClick={() => handleAddDish(cat.categoryID)}
                      disabled={cat.status === 0}
                    >
                      + Thêm món
                    </button>
                    <button
                      className={`btn ${
                        cat.status === 1 ? "btn-outline-danger" : "btn-outline-secondary"
                      }`}
                      onClick={() => handleToggleCategoryStatus(cat.categoryID)}
                    >
                      {cat.status === 1 ? "Ẩn loại" : "Khôi phục"}
                    </button>
                  </div>
                </div>

                {/* --- Danh sách món trong category --- */}
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th style={{ width: "40%" }}>Tên món</th>
                      <th style={{ width: "20%" }}>Trạng thái</th>
                      <th style={{ width: "20%" }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryDishes.length > 0 ? (
                      categoryDishes.map((d) => (
                        <tr key={d.dishID}>
                          <td>{d.name}</td>
                          <td>
                            <span
                              className={`badge ${
                                d.status === 1 ? "bg-success" : "bg-secondary"
                              }`}
                            >
                              {d.status === 1 ? "Đang bán" : "Ngừng bán"}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => setActiveDish(d)}
                              >
                                Xem
                              </button>
                              <button
                                className={`btn btn-sm ${
                                  d.status === 1
                                    ? "btn-outline-danger"
                                    : "btn-outline-success"
                                }`}
                                onClick={() => handleToggleDishStatus(d.dishID)}
                              >
                                {d.status === 1 ? "Ẩn" : "Hiện"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center text-muted">
                          Chưa có món nào trong loại này.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}