import React, { useEffect, useState } from "react";
import axios from "../../../../api/axios";
import AdminLayout from "../../../../layouts/AdminLayout";
import { Modal, Button } from "react-bootstrap";

export default function ReviewList() {
  const [reviews, setReviews] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const res = await axios.get("/admin/reviews");
      setReviews(res.data.data);
    } catch (err) {
      console.error("❌ Fetch reviews failed:", err);
    }
  };

  const viewDetail = async (id) => {
    try {
      const res = await axios.get(`/admin/reviews/${id}`);
      setSelected(res.data.data);
      setShowDetail(true);
    } catch (err) {
      console.error("❌ Load review detail failed:", err);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá đánh giá này?")) return;

    try {
      await axios.delete(`/admin/reviews/${id}`);
      loadReviews();
      alert("Đã xoá thành công!");
    } catch (err) {
      console.error("❌ Delete review failed:", err);
    }
  };

  return (
    <AdminLayout title="Quản lý đánh giá">
      <div className="container py-4">
        <h4 className="fw-bold mb-3">Danh sách đánh giá</h4>

        <div className="card shadow-sm">
          <div className="card-body table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Khách hàng</th>
                  <th>Rating</th>
                  <th>Nhà hàng</th>
                  <th>Ngày tạo</th>
                  <th className="text-end">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.reviewID}>
                    <td>{r.reviewID}</td>
                    <td>{r.customer?.user?.fullName}</td>
                    <td>
                      {"⭐".repeat(r.rating)} <small>({r.rating})</small>
                    </td>
                    <td>{r.booking?.hall?.restaurant?.name}</td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>

                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => viewDetail(r.reviewID)}
                      >
                        Chi tiết
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteReview(r.reviewID)}
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))}

                {reviews.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      Không có đánh giá nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        <Modal show={showDetail} onHide={() => setShowDetail(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Chi tiết đánh giá</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {selected ? (
              <>
                <p>
                  <strong>Khách hàng:</strong>{" "}
                  {selected.customer?.user?.fullName}
                </p>
                <p>
                  <strong>Rating:</strong> {selected.rating}⭐
                </p>
                <p>
                  <strong>Bình luận:</strong>
                  <br />
                  {selected.comment}
                </p>
                <p>
                  <strong>Nhà hàng:</strong>{" "}
                  {selected.booking?.hall?.restaurant?.name}
                </p>
                <p>
                  <strong>Ngày tạo:</strong>{" "}
                  {new Date(selected.createdAt).toLocaleString()}
                </p>
              </>
            ) : (
              "Đang tải..."
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDetail(false)}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AdminLayout>
  );
}
