-- ========================================
-- Script XÓA dữ liệu TEST
-- Copy toàn bộ script này và paste vào MySQL
-- ========================================

USE WeddingRestaurantManagement;

SET FOREIGN_KEY_CHECKS = 0;

-- Xóa Booking
DELETE FROM Booking WHERE customerID IN (
    SELECT customerID FROM Customer WHERE customerID IN (
        SELECT userID FROM User WHERE email = 'testcustomer@test.com'
    )
);

-- Xóa RestaurantEventType
DELETE FROM RestaurantEventType WHERE restaurantID IN (
    SELECT restaurantID FROM Restaurant WHERE restaurantPartnerID IN (
        SELECT userID FROM User WHERE email = 'testpartner@test.com'
    )
);

-- Xóa Menu
DELETE FROM Menu WHERE restaurantID IN (
    SELECT restaurantID FROM Restaurant WHERE restaurantPartnerID IN (
        SELECT userID FROM User WHERE email = 'testpartner@test.com'
    )
);

-- Xóa Hall
DELETE FROM Hall WHERE restaurantID IN (
    SELECT restaurantID FROM Restaurant WHERE restaurantPartnerID IN (
        SELECT userID FROM User WHERE email = 'testpartner@test.com'
    )
);

-- Xóa Restaurant và Address
DELETE FROM Restaurant WHERE restaurantPartnerID IN (
    SELECT userID FROM User WHERE email = 'testpartner@test.com'
);

DELETE FROM Address WHERE number = '123' AND street = 'Test Street';

-- Xóa RestaurantPartner
DELETE FROM RestaurantPartner WHERE restaurantPartnerID IN (
    SELECT userID FROM User WHERE email = 'testpartner@test.com'
);

-- Xóa Customer
DELETE FROM Customer WHERE customerID IN (
    SELECT userID FROM User WHERE email = 'testcustomer@test.com'
);

-- Xóa User
DELETE FROM User WHERE email IN ('testcustomer@test.com', 'testpartner@test.com');

SET FOREIGN_KEY_CHECKS = 1;

SELECT '✅ Test data cleaned successfully!' as Message;
