import React, { useEffect, useState } from "react";
import axios from "../../../../api/axios";
import AdminLayout from "../../../../layouts/AdminLayout";
import { Modal, Button, Badge } from "react-bootstrap";

export default function ReportList() {
  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const res = await axios.get("/admin/reports");
      setReports(res.data.data);
    } catch (err) {
      console.error("❌ Fetch reports failed:", err);
    }
  };

  const viewDetail = async (id) => {
    try {
      const res = await axios.get(`/admin/reports/${id}`);
      setSelected(res.data.data);
      setShowDetail(true);
    } catch (err) {
      console.error("❌ Load report detail failed:", err);
    }
  };

  const updateStatus = async (id, status) => {
    if (!window.confirm("Bạn muốn cập nhật trạng thái báo cáo?")) return;

    try {
      await axios.put(`/admin/reports/${id}/status`, { status });
      loadReports();
      alert("Cập nhật thành công!");
    } catch (err) {
      console.error("❌ Update report failed:", err);
    }
  };

  const deleteReport = async (id) => {
    if (!window.confirm("Bạn chắc chắn xoá báo cáo này?")) return;

    try {
      await axios.delete(`/admin/reports/${id}`);
      loadReports();
      alert("Đã xoá thành công!");
    } catch (err) {
      console.error("❌ Delete report failed:", err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 0:
        return <Badge bg="warning">Chờ xử lý</Badge>;
      case 1:
        return <Badge bg="success">Đã xử lý</Badge>;
      case 2:
        return <Badge bg="danger">Từ chối</Badge>;
      default:
        return <Badge bg="secondary">Không rõ</Badge>;
    }
  };

  return (
    <AdminLayout title="Quản lý báo cáo">
      <div className="container py-4">
        <h4 className="fw-bold mb-3">Danh sách báo cáo</h4>

        <div className="card shadow-sm">
          <div className="card-body table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Người báo cáo</th>
                  <th>Loại mục tiêu</th>
                  <th>Nội dung</th>
                  <th>Trạng thái</th>
                  <th className="text-end">Hành động</th>
                </tr>
              </thead>

              <tbody>
                {reports.map((r) => (
                  <tr key={r.reportID}>
                    <td>{r.reportID}</td>
                    <td>{r.user?.fullName}</td>
                    <td>{r.targetType === 1 ? "Nhà hàng" : "Đánh giá"}</td>
                    <td>{r.content?.slice(0, 40)}...</td>
                    <td>{getStatusBadge(r.status)}</td>

                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => viewDetail(r.reportID)}
                      >
                        Chi tiết
                      </button>

                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => updateStatus(r.reportID, 1)}
                      >
                        Duyệt
                      </button>

                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => updateStatus(r.reportID, 2)}
                      >
                        Từ chối
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteReport(r.reportID)}
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))}

                {reports.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      Không có báo cáo nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* DETAIL MODAL */}
        <Modal show={showDetail} onHide={() => setShowDetail(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Chi tiết báo cáo</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {selected ? (
              <>
                <p>
                  <strong>Người báo cáo:</strong> {selected.user?.fullName}
                </p>

                <p>
                  <strong>Nội dung báo cáo:</strong>
                  <br />
                  {selected.content}
                </p>

                <p>
                  <strong>Loại mục tiêu:</strong>{" "}
                  {selected.targetType === 1 ? "Nhà hàng" : "Đánh giá"}
                </p>

                {selected.review && (
                  <>
                    <hr />
                    <p>
                      <strong>Đánh giá liên quan:</strong>
                    </p>
                    <p>
                      Rating: {selected.review.rating}⭐
                      <br />
                      Comment: {selected.review.comment}
                    </p>
                  </>
                )}
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
