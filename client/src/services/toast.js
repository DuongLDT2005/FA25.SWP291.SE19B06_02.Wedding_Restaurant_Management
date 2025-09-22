
import React from "react";
import ReactDOM from "react-dom/client";
import "../styles/toastStyles.css";

// Hàm showToast để hiển thị thông báo
export const showToast = (message, type = "success") => {
  // Nếu chưa có container thì tạo mới
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  // Tạo element gốc
  const toastElement = document.createElement("div");
  container.appendChild(toastElement);

  const root = ReactDOM.createRoot(toastElement);

  // Component Toast
  const Toast = ({ message, type }) => {
    const handleClose = () => {
      root.unmount();
      container.removeChild(toastElement);
    };

    React.useEffect(() => {
      const timer = setTimeout(() => handleClose(), 5000);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div className={`toast-message ${type}`}>
        <span>{message}</span>
        <button className="toast-close" onClick={handleClose}>
          ✖
        </button>
      </div>
    );
  };

  root.render(<Toast message={message} type={type} />);
};
