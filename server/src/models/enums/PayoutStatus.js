
class PayoutStatus {
    method = {
        PAYOS: 0,
        BANK_TRANSFER: 1,
        CARD: 2,
        CASH: 3,
     };
     status = {
        PENDING: 0,
        PROCESSING: 1,
        SUCCESS: 2,
        FAILED: 3,
        CANCELLED: 4,
     };
}
export const PayoutStatus = new PayoutStatus();