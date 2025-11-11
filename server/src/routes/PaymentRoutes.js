import { Router } from "express";
import PaymentController from "../controllers/PaymentController.js";

const router = Router();

// Create PayOS checkout link for a booking
router.post("/payos/checkout/:bookingID", PaymentController.createPayosCheckout);

// PayOS webhook endpoint
router.post("/payos/webhook", PaymentController.payosWebhook);

// Query PayOS status by orderCode (for client to confirm on return page)
router.get("/payos/status/:orderCode", PaymentController.getPayosStatus);



export default router;
