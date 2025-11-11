import React from "react";
import { Card, Form, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

const PaymentMethods = ({
  paymentMethod,
  setPaymentMethod,
  handlePayment,
  isProcessing,
  timeLeft,
  depositAmount,
  actualBookingId,
  formatCurrency,
}) => {
  return (
    <Card className="shadow-sm h-100">
      <Card.Header>
        <h5 className="mb-0">
          <i className="fas fa-university me-2"></i> Phương thức thanh toán
        </h5>
      </Card.Header>
      <Card.Body>
        <Form>
          <Form.Check
            type="radio"
            id="bank_transfer"
            label="Chuyển khoản ngân hàng"
            name="paymentMethod"
            value="bank_transfer"
            checked={paymentMethod === "bank_transfer"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mb-2"
          />
          <Form.Check
            type="radio"
            id="momo"
            label="Ví MoMo"
            name="paymentMethod"
            value="momo"
            checked={paymentMethod === "momo"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mb-2"
          />
          <Form.Check
            type="radio"
            id="zalopay"
            label="ZaloPay"
            name="paymentMethod"
            value="zalopay"
            checked={paymentMethod === "zalopay"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
        </Form>

        <div className="mt-4">
          <Button
            variant="primary"
            className="w-100"
            onClick={handlePayment}
            disabled={isProcessing || timeLeft <= 0}
          >
            {isProcessing ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  className="me-2"
                />
                Đang xử lý...
              </>
            ) : (
              <>
                <i className="fas fa-credit-card me-2"></i> Thanh toán{" "}
                {formatCurrency(depositAmount)}
              </>
            )}
          </Button>
        </div>

        <div className="text-center mt-3">
          <Button
            as={Link}
            to={`/booking/${actualBookingId}`}
            variant="outline-secondary"
          >
            <i className="fas fa-arrow-left me-2"></i> Quay lại
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PaymentMethods;
