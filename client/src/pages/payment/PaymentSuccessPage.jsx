// client/src/pages/payment/PaymentSuccessPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../../styles/PaymentSuccessStyles.css";
import SuccessHeader from "./components/PaymentSuccess/SuccessHeader";
import PaymentDetails from "./components/PaymentSuccess/PaymentDetails";
import BookingSummary from "./components/PaymentSuccess/BookingSummary";
import ActionButtons from "./components/PaymentSuccess/ActionButtons";
import NextSteps from "./components/PaymentSuccess/NextSteps";

const PaymentSuccessPage = () => {
  const location = useLocation();
  const [paymentData, setPaymentData] = useState(null);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const bookingInfo = JSON.parse(sessionStorage.getItem("currentBooking") || "{}");
    setBookingData(bookingInfo);

    if (bookingInfo?.payments?.length > 0) {
      const latest = bookingInfo.payments[bookingInfo.payments.length - 1];
      setPaymentData({
        transactionId: "TXN-" + Date.now(),
        amount: latest.amount,
        paymentMethod: latest.paymentMethod,
        paymentDate: latest.paymentDate,
      });
    }
  }, []);

  if (!paymentData)
    return (
      <div className="alert alert-warning text-center mt-5">
        <i className="fas fa-exclamation-triangle me-2"></i>
        Không tìm thấy thông tin thanh toán.
      </div>
    );

  return (
    <div className="payment-success-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <SuccessHeader />
            <PaymentDetails paymentData={paymentData} />
            <BookingSummary bookingData={bookingData} />
            <ActionButtons bookingData={bookingData} />
            <NextSteps />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
