import express from 'express';
import BookingController from '../controllers/BookingController.js';

const router = express.Router();

// ========== CRUD CƠ BẢN ==========

// GET /api/bookings - Get all bookings
router.get('/', BookingController.getAllBookings);

// GET /api/bookings/customer/:customerID - Get bookings by customer (phải đặt trước /:id)
router.get('/customer/:customerID', BookingController.getBookingsByCustomerId);

// GET /api/bookings/restaurant/:restaurantID - Get bookings by restaurant
router.get('/restaurant/:restaurantID', BookingController.getBookingsByRestaurantId);

// GET /api/bookings/restaurant/:restaurantID/status/:status - Get by restaurant and status
router.get('/restaurant/:restaurantID/status/:status', BookingController.getBookingsByRestaurantAndStatus);

// GET /api/bookings/restaurant/:restaurantID/statistics - Get restaurant statistics
router.get('/restaurant/:restaurantID/statistics', BookingController.getRestaurantStatistics);

// GET /api/bookings/restaurant/:restaurantID/pending - Get pending bookings for restaurant
router.get('/restaurant/:restaurantID/pending', BookingController.getPendingBookingsForRestaurant);

// GET /api/bookings/restaurant/:restaurantID/need-deposit - Get bookings needing deposit
router.get('/restaurant/:restaurantID/need-deposit', BookingController.getBookingsNeedingDeposit);

// GET /api/bookings/hall/:hallID - Get bookings by hall
router.get('/hall/:hallID', BookingController.getBookingsByHallId);

// GET /api/bookings/event-type/:eventTypeID - Get bookings by event type
router.get('/event-type/:eventTypeID', BookingController.getBookingsByEventType);

// GET /api/bookings/status/:status - Get bookings by status
router.get('/status/:status', BookingController.getBookingsByStatus);

// GET /api/bookings/count/:status - Count bookings by status
router.get('/count/:status', BookingController.countBookingsByStatus);

// GET /api/bookings/date-range?startDate=&endDate= - Get bookings by date range
router.get('/date-range', BookingController.getBookingsByDateRange);

// GET /api/bookings/upcoming?days=7 - Get upcoming bookings
router.get('/upcoming', BookingController.getUpcomingBookings);

// GET /api/bookings/unchecked - Get unchecked bookings
router.get('/unchecked', BookingController.getUncheckedBookings);

// GET /api/bookings/statistics - Get bookings statistics
router.get('/statistics', BookingController.getBookingsStatistics);

// GET /api/bookings/revenue?startDate=&endDate= - Get total revenue
router.get('/revenue', BookingController.getTotalRevenue);

// GET /api/bookings/active - Get active bookings
router.get('/active', BookingController.getActiveBookings);

// GET /api/bookings/:id - Get booking by ID (phải đặt cuối cùng)
router.get('/:id', BookingController.getBookingById);

// POST /api/bookings - Create new booking
router.post('/', BookingController.createBooking);

// POST /api/bookings/check-availability - Check hall availability
router.post('/check-availability', BookingController.checkHallAvailability);

// POST /api/bookings/mark-expired - Mark expired bookings (scheduled task)
router.post('/mark-expired', BookingController.markExpiredBookings);

// PUT /api/bookings/:id - Update booking
router.put('/:id', BookingController.updateBooking);

// ========== QUẢN LÝ TRẠNG THÁI ==========

// PUT /api/bookings/:id/accept - Accept booking
router.put('/:id/accept', BookingController.acceptBooking);

// PUT /api/bookings/:id/reject - Reject booking
router.put('/:id/reject', BookingController.rejectBooking);

// PUT /api/bookings/:id/confirm - Confirm booking
router.put('/:id/confirm', BookingController.confirmBooking);

// PUT /api/bookings/:id/deposit - Mark as deposited
router.put('/:id/deposit', BookingController.markAsDeposited);

// PUT /api/bookings/:id/complete - Complete booking
router.put('/:id/complete', BookingController.completeBooking);

// PUT /api/bookings/:id/cancel - Cancel booking
router.put('/:id/cancel', BookingController.cancelBooking);

// PUT /api/bookings/:id/status - Update booking status
router.put('/:id/status', BookingController.updateBookingStatus);

// PUT /api/bookings/:id/check - Update checked status
router.put('/:id/check', BookingController.updateCheckedStatus);

// DELETE /api/bookings/:id - Delete booking
router.delete('/:id', BookingController.deleteBooking);

export default router;
