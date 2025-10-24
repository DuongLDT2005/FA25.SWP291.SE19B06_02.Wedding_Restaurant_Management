import BookingServices from '../BookingServices.js';

// Mock the DAO module that BookingServices depends on
jest.mock('../../dao/BookingDAO.js', () => ({
  __esModule: true,
  default: {
    createBooking: jest.fn(),
    getBookingsByCustomer: jest.fn(),
    updateBookingStatus: jest.fn(),
    markBookingAsChecked: jest.fn()
  }
}));

import BookingDAO from '../../dao/BookingDAO.js';

describe('BookingServices (unit tests with mocked DAO)', () => {
  beforeEach(() => {
    // reset mock implementations and call history
    jest.clearAllMocks();
  });

  test('createBooking forwards data to BookingDAO.createBooking and returns result', async () => {
    const input = { customerID: 1, eventDate: '2025-12-01' };
    const fakeResult = { bookingID: 42, ...input };
    BookingDAO.default.createBooking.mockResolvedValue(fakeResult);

    const result = await BookingServices.createBooking(input);

    expect(BookingDAO.default.createBooking).toHaveBeenCalledTimes(1);
    expect(BookingDAO.default.createBooking).toHaveBeenCalledWith(input);
    expect(result).toBe(fakeResult);
  });

  test('getBookingsByCustomer forwards filters to DAO', async () => {
    const filters = { customerID: 2, status: 0 };
    const fakeBookings = [{ bookingID: 10 }, { bookingID: 11 }];
    BookingDAO.default.getBookingsByCustomer.mockResolvedValue(fakeBookings);

    const result = await BookingServices.getBookingsByCustomer(filters);

    expect(BookingDAO.default.getBookingsByCustomer).toHaveBeenCalledWith(filters);
    expect(result).toBe(fakeBookings);
  });

  test('updateBookingStatus forwards params and returns DAO result', async () => {
    BookingDAO.default.updateBookingStatus.mockResolvedValue(true);

    const res = await BookingServices.updateBookingStatus(5, 1);

    expect(BookingDAO.default.updateBookingStatus).toHaveBeenCalledWith(5, 1);
    expect(res).toBe(true);
  });

  test('markBookingAsChecked forwards params to DAO', async () => {
    BookingDAO.default.markBookingAsChecked.mockResolvedValue(true);

    const res = await BookingServices.markBookingAsChecked(6, 1);

    expect(BookingDAO.default.markBookingAsChecked).toHaveBeenCalledWith(6, 1);
    expect(res).toBe(true);
  });
});
