import { isBefore, addHours, addYears, parseISO, formatISO, isValid as isValidDate } from 'date-fns';

/**
 * Enum for booking statuses.
 */
const BookingStatus = Object.freeze({
    PENDING: 0,
    ACCEPTED: 1,
    REJECTED: 2,
    CONFIRMED: 3,
    DEPOSITED: 4,
    EXPIRED: 5,
    CANCELLED: 6,
    COMPLETED: 7,
});

class Booking {
    bookingID;
    customerID;
    eventTypeID;
    hallID;
    menuID;
    eventDate;
    startTime;
    endTime;
    tableCount;
    specialRequest;
    status;
    originalPrice;
    discountAmount;
    VAT;
    totalAmount;
    createdAt;
    isChecked;
    dishes = [];
    services = [];
    promotions = [];
    #freeServices = new Set();
    #vatRate = 0.08;

    constructor({
        bookingID,
        customerID,
        eventTypeID,
        hallID,
        menuID,
        eventDate,
        startTime,
        endTime,
        tableCount = 1,
        specialRequest = "",
        status = BookingStatus.PENDING,
        originalPrice = 0,
        discountAmount = 0,
        VAT = 0,
        totalAmount = 0,
        createdAt = new Date(),
        isChecked = false,
        dishes = [],
        services = [],
        promotions = [],
        // ---------------- INJECTED DAOS ---------------- 
        customerDAO,
        eventTypeDAO,
        hallDAO,
        menuDAO, } = {}) {
        Object.assign(this, {
            bookingID,
            customerID,
            eventTypeID,
            hallID,
            menuID,
            eventDate,
            startTime,
            endTime,
            tableCount,
            specialRequest,
            status,
            originalPrice,
            discountAmount,
            VAT,
            totalAmount,
            createdAt,
            isChecked,
            dishes,
            services,
            promotions,
            customerDAO,
            eventTypeDAO,
            hallDAO,
            menuDAO,
        });
    }
    
}

export default Booking;
