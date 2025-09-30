import React from "react";

export default function RatingStars({ rating }) {
  

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="d-flex align-items-center">
      {/* Sao đầy */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <i key={`full-${i}`} className="bi bi-star-fill text-warning fs-7 me-1"></i>
      ))}

      {/* Sao nửa */}
      {hasHalfStar && (
        <i className="bi bi-star-half text-warning fs-7 me-1"></i>
      )}

      {/* Sao rỗng */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <i key={`empty-${i}`} className="bi bi-star text-warning fs-7 me-1"></i>
      ))}
    </div>
  );
}
