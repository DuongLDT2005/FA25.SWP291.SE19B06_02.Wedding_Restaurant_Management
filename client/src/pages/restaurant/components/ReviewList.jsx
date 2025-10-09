import React, { useState } from "react";
import Pagination from "../../../components/Pagination";
import RatingStars from "../../../components/RatingStars";

const ReviewList = ({ reviews, pageSize = 3 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(reviews.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentReviews = reviews.slice(startIndex, startIndex + pageSize);

  return (
    <div>
      <h4 className="section-title mb-4" style={{ color: "#993344" }}>
        Đánh giá
      </h4>

      {reviews.length === 0 ? (
        <p className="text-muted">Chưa có đánh giá nào.</p>
      ) : (
        <>
          {currentReviews.map((review) => (
            <div
              key={review.id}
              className="card mb-3 border-0 shadow-sm"
              style={{ borderRadius: "12px" }}
            >
              <div className="card-body d-flex align-items-start">
                {/* Avatar chữ cái đầu */}
                <div
                  className="me-3"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "#993344",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                  }}
                >
                  {review.customerName.charAt(0).toUpperCase()}
                </div>

                <div className="flex-grow-1">
                  <h5
                    className="card-title mb-1"
                    style={{ color: "#993344", fontSize: "1.1rem" }}
                  >
                    {review.customerName}
                  </h5>
                  <div className="d-flex align-items-center mb-2">
                    <RatingStars rating={review.rating} color="#993344" />
                    <span
                      className="text-muted ms-2"
                      style={{ fontSize: "0.85rem" }}
                    >
                      -{" "}
                      {new Date(review.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p
                    className="card-text"
                    style={{ color: "#333", fontSize: "0.95rem" }}
                  >
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default ReviewList;