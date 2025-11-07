CREATE DATABASE IF NOT EXISTS WeddingRestaurantManagement
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE WeddingRestaurantManagement;

-- Table User
CREATE TABLE User (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    fullName VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatarURL VARCHAR(255) DEFAULT NULL,
    role TINYINT UNSIGNED NOT NULL, -- 0: CUSTOMER, 1: RESTAURANT_PARTNER, 2: ADMIN
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    status BIT DEFAULT 1 -- 0: INACTIVE, 1: ACTIVE
);

-- Table Customer
CREATE TABLE Customer (
    customerID INT PRIMARY KEY,
    weddingRole TINYINT UNSIGNED NOT NULL, -- 0: BRIDE, 1: GROOM, 2: OTHER
    partnerName VARCHAR(255),
    FOREIGN KEY (customerID) REFERENCES User(userID) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Table RestaurantPartner
CREATE TABLE RestaurantPartner (
    restaurantPartnerID INT PRIMARY KEY,
    licenseUrl VARCHAR(255) NOT NULL,
    status TINYINT UNSIGNED NOT NULL DEFAULT 0, -- 0: PENDING, 1: REJECTED, 2: NEGOTIATING, 3: ACTIVE, 4: INACTIVE
	commissionRate DECIMAL(3,2) DEFAULT NULL CHECK (commissionRate >= 0 AND commissionRate <= 1),
    FOREIGN KEY (restaurantPartnerID) REFERENCES User(userID) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Table Address
CREATE TABLE Address (
    addressID INT AUTO_INCREMENT PRIMARY KEY,
    number VARCHAR(10) NOT NULL,
    street VARCHAR(100) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    fullAddress VARCHAR(255) AS (CONCAT(number, ' ', street, ', ', ward)) STORED
);

-- Table Restaurant
CREATE TABLE Restaurant (
    restaurantID INT AUTO_INCREMENT PRIMARY KEY,
    restaurantPartnerID INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    description VARCHAR(255),
    hallCount INT DEFAULT 0,
    addressID INT NOT NULL,
    thumbnailURL VARCHAR(255) NOT NULL,
    avgRating DECIMAL(2,1) DEFAULT 0,
    totalReviews INT DEFAULT 0,
    status BIT DEFAULT 1, -- 0: INACTIVE, 1: ACTIVE
    FOREIGN KEY (restaurantPartnerID) REFERENCES RestaurantPartner(restaurantPartnerID) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (addressID) REFERENCES Address(addressID) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Table RestaurantImage
CREATE TABLE RestaurantImage (
    imageID INT AUTO_INCREMENT PRIMARY KEY,
    restaurantID INT NOT NULL,
    imageURL VARCHAR(255) NOT NULL,
    FOREIGN KEY (restaurantID) REFERENCES Restaurant(restaurantID) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Table BankAccount
CREATE TABLE BankAccount (
    accountID INT AUTO_INCREMENT PRIMARY KEY,
    restaurantPartnerID INT NOT NULL,
    bankName VARCHAR(255) NOT NULL,
    accountNumber VARCHAR(255) NOT NULL,
    accountHolder VARCHAR(255) NOT NULL,
    branch VARCHAR(255),
    status BIT DEFAULT 1, -- 0: INACTIVE, 1: ACTIVE
    FOREIGN KEY (restaurantPartnerID) REFERENCES RestaurantPartner(restaurantPartnerID) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Table Amenity
CREATE TABLE Amenity (
    amenityID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    status BIT DEFAULT 1 -- 0: INACTIVE, 1: ACTIVE
);

-- Table RestaurantAmenities
CREATE TABLE RestaurantAmenities (
    restaurantID INT NOT NULL,
    amenityID INT NOT NULL,
    PRIMARY KEY (restaurantID, amenityID),
	FOREIGN KEY (restaurantID) REFERENCES Restaurant(restaurantID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (amenityID) REFERENCES Amenity(amenityID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table Hall
CREATE TABLE Hall (
    hallID INT AUTO_INCREMENT PRIMARY KEY,
    restaurantID INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
	minTable INT CHECK (minTable >= 0),
    maxTable INT CHECK (maxTable > 0),
    CHECK (minTable <= maxTable),
    area DECIMAL(7,2) NOT NULL CHECK (area > 0),
    price DECIMAL(15,2) NOT NULL CHECK (price >= 0),
    status BIT DEFAULT 1, -- 0: INACTIVE, 1: ACTIVE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurantID) REFERENCES Restaurant(restaurantID) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Table HallImage
CREATE TABLE HallImage (
    imageID INT AUTO_INCREMENT PRIMARY KEY,
    hallID INT NOT NULL,
    imageURL VARCHAR(255) NOT NULL,
    FOREIGN KEY (hallID) REFERENCES Hall(hallID) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Table Menu
CREATE TABLE Menu (
    menuID INT AUTO_INCREMENT PRIMARY KEY,
    restaurantID INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    imageURL VARCHAR(255),
    status BIT DEFAULT 1, -- 0: INACTIVE, 1: ACTIVE
    FOREIGN KEY (restaurantID) REFERENCES Restaurant(restaurantID) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Table DishCategory
CREATE TABLE DishCategory (
    categoryID INT AUTO_INCREMENT PRIMARY KEY,
    restaurantID INT NOT NULL.
    name VARCHAR(50) NOT NULL,
    requiredQuantity INT DEFAULT 1 CHECK(requiredQuantity > 0),
    status BIT DEFAULT 1, -- 0: INACTIVE, 1: ACTIVE
    FOREIGN KEY (restaurantID) REFERENCES Restaurant(restaurantID) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Table Dish
CREATE TABLE Dish (
    dishID INT AUTO_INCREMENT PRIMARY KEY,
    restaurantID INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    categoryID INT NOT NULL,
    imageURL VARCHAR(255),
    status BIT DEFAULT 1, -- 0: INACTIVE, 1: ACTIVE
    FOREIGN KEY (categoryID) REFERENCES DishCategory(categoryID) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (restaurantID) REFERENCES Restaurant(restaurantID) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Table DishMenu (many-to-many)
CREATE TABLE DishMenu (
    menuID INT NOT NULL,
    dishID INT NOT NULL,
    PRIMARY KEY (menuID, dishID),
    FOREIGN KEY (menuID) REFERENCES Menu(menuID) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (dishID) REFERENCES Dish(dishID) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Table EventType
CREATE TABLE EventType (
    eventTypeID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    status BIT NOT NULL DEFAULT 1
);

-- Table RestaurantEventType (many-to-many)
CREATE TABLE RestaurantEventType (
    restaurantID INT NOT NULL,
    eventTypeID INT NOT NULL,
    PRIMARY KEY (restaurantID, eventTypeID),

    CONSTRAINT FK_RestaurantEventType_Restaurant
        FOREIGN KEY (restaurantID) REFERENCES Restaurant(restaurantID)
        ON UPDATE CASCADE ON DELETE CASCADE,

    CONSTRAINT FK_RestaurantEventType_EventType
        FOREIGN KEY (eventTypeID) REFERENCES EventType(eventTypeID)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- Table Service
CREATE TABLE Service (
    serviceID INT AUTO_INCREMENT PRIMARY KEY,
    restaurantID INT NOT NULL,
    eventTypeID INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    unit VARCHAR(50),
    status BIT DEFAULT 1, -- 0: INACTIVE, 1: ACTIVE
    FOREIGN KEY (restaurantID) REFERENCES Restaurant(restaurantID) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (eventTypeID) REFERENCES EventType(eventTypeID) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Table Promotion
CREATE TABLE Promotion (
    promotionID INT AUTO_INCREMENT PRIMARY KEY,
    restaurantID INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    minTable INT DEFAULT 0 CHECK(minTable >= 0),
    discountType TINYINT NOT NULL,  -- 0: PERCENT, 1: FREE
    discountValue DECIMAL(15,2) CHECK(discountValue >= 0),
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    status BIT DEFAULT 1, -- 0: INACTIVE, 1: ACTIVE
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurantID) REFERENCES Restaurant(restaurantID) ON UPDATE CASCADE ON DELETE CASCADE,
    CHECK (startDate <= endDate)
);

-- Table PromotionService (many-to-many)
CREATE TABLE PromotionService (
    promotionID INT NOT NULL,
    serviceID INT NOT NULL,
    PRIMARY KEY (promotionID, serviceID),
    FOREIGN KEY (promotionID) REFERENCES Promotion(promotionID) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (serviceID) REFERENCES Service(serviceID) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Table Booking
CREATE TABLE Booking (
    bookingID INT AUTO_INCREMENT PRIMARY KEY,
    customerID INT NOT NULL,
    eventTypeID INT NOT NULL,
    hallID INT NOT NULL,
    menuID INT NOT NULL,
    eventDate DATE NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    tableCount INT DEFAULT 1 CHECK(tableCount > 0),
    specialRequest VARCHAR(255),
    status TINYINT UNSIGNED NOT NULL DEFAULT 0, -- 0: PENDING, 1: ACCEPTED, 2: REJECTED, 3: CONFIRMED, 4: DEPOSITED, 5: EXPIRED, 6: CANCELLED, 7: COMPLETED
    originalPrice DECIMAL(15,2) NOT NULL,
    discountAmount DECIMAL(15,2) DEFAULT 0,
    VAT DECIMAL(15,2) NOT NULL,
    totalAmount DECIMAL(15,2) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    isChecked BIT DEFAULT 0, -- 0: UNCHECKED, 1: CHECKED
    FOREIGN KEY (customerID) REFERENCES Customer(customerID) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (eventTypeID) REFERENCES EventType(eventTypeID) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (hallID) REFERENCES Hall(hallID) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (menuID) REFERENCES Menu(menuID) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Table BookingDish
CREATE TABLE BookingDish (
    bookingID INT NOT NULL,
    dishID INT NOT NULL,
    PRIMARY KEY (bookingID, dishID),
    FOREIGN KEY (bookingID) REFERENCES Booking(bookingID) ON DELETE CASCADE,
    FOREIGN KEY (dishID) REFERENCES Dish(dishID) ON DELETE CASCADE
);

-- Table BookingService
CREATE TABLE BookingService (
    bookingID INT NOT NULL,
    serviceID INT NOT NULL,
    quantity INT DEFAULT 1 CHECK(quantity > 0),
    appliedPrice DECIMAL(15,2) NOT NULL,
    PRIMARY KEY (bookingID, serviceID),
    FOREIGN KEY (bookingID) REFERENCES Booking(bookingID) ON DELETE CASCADE,
    FOREIGN KEY (serviceID) REFERENCES Service(serviceID) ON DELETE CASCADE
);

-- Table BookingPromotion
CREATE TABLE BookingPromotion (
    bookingID INT NOT NULL,
    promotionID INT NOT NULL,
    PRIMARY KEY (bookingID, promotionID),
    FOREIGN KEY (bookingID) REFERENCES Booking(bookingID) ON DELETE CASCADE,
    FOREIGN KEY (promotionID) REFERENCES Promotion(promotionID) ON DELETE CASCADE
);

-- Table Payment
CREATE TABLE Payment (
    paymentID INT AUTO_INCREMENT PRIMARY KEY,
    bookingID INT NOT NULL,
    restaurantID INT NOT NULL,
    amount DECIMAL(15,2) NOT NULL CHECK(amount >= 0),
    type TINYINT UNSIGNED DEFAULT 0, -- 0: DEPOSIT, 1: REMAINING, 2: REFUND
    paymentMethod TINYINT UNSIGNED DEFAULT 0, -- 0: PAYOS, 1: BANK_TRANSFER, 2: CARD, 3: CASH
    status TINYINT UNSIGNED NOT NULL DEFAULT 0, -- 0: PENDING, 1: PROCESSING, 2: SUCCESS, 3: FAILED, 4: REFUNDED, 5: CANCELLED
    transactionRef VARCHAR(255) UNIQUE,
    paymentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    released bit DEFAULT 0,
    refundedAmount DECIMAL(15,2) DEFAULT 0 CHECK (refundedAmount >= 0), -- Tiền đã hoàn lại (nếu có)
    refundReason VARCHAR(255) DEFAULT NULL, -- Lý do hoàn tiền
    refundDate DATETIME DEFAULT NULL, -- Ngày hoàn tiền
    refundTransactionRef VARCHAR(255) UNIQUE,
    providerResponse TEXT, -- Log hoặc JSON phản hồi từ PayOS
    FOREIGN KEY (bookingID) REFERENCES Booking(bookingID) ON DELETE CASCADE,
    FOREIGN KEY (restaurantID) REFERENCES Restaurant(restaurantID) ON DELETE CASCADE
);

CREATE TABLE RefundPolicy (
    policyId  INT AUTO_INCREMENT PRIMARY KEY,
    restaurantId INT NOT NULL,          -- Mỗi nhà hàng có thể có nhiều mốc refund
    daysBeforeEvent INT NOT NULL,             -- Số ngày trước tiệc
    refundPercent DECIMAL(5,2) NOT NULL,    -- % được hoàn (VD: 100.00, 50.00, 0.00)
    description VARCHAR(255),             -- Diễn giải (VD: "Hủy trước 7 ngày hoàn toàn bộ")
    isDefault BOOLEAN DEFAULT FALSE,    -- Dùng nếu muốn set 1 chính sách mặc định
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurantId) REFERENCES Restaurant(restaurantId)
);

-- Table Payouts
CREATE TABLE Payouts (
    payoutId INT AUTO_INCREMENT PRIMARY KEY,
    paymentId INT NOT NULL,
    restaurantPartnerId INT NOT NULL,

    grossAmount DECIMAL(15,2) NOT NULL CHECK (grossAmount >= 0),
    commissionAmount DECIMAL(15,2) NOT NULL CHECK (commissionAmount >= 0),
    payoutAmount DECIMAL(15,2) NOT NULL CHECK (payoutAmount >= 0),

    method TINYINT UNSIGNED NOT NULL DEFAULT 0,   -- 0: PAYOS, 1: BANK_TRANSFER, 2: CARD, 3: CASH
    status TINYINT UNSIGNED NOT NULL DEFAULT 0,   -- 0: PENDING, 1: PROCESSING, 2: SUCCESS, 3: FAILED, 4: CANCELLED

    transactionRef VARCHAR(255) UNIQUE,
    note VARCHAR(255),

    releasedBy INT,
    releasedAt DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_payout_payment FOREIGN KEY (paymentId)
        REFERENCES Payment(paymentID)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_payout_restaurantPartner FOREIGN KEY (restaurantPartnerId)
        REFERENCES RestaurantPartner(restaurantPartnerID)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_payout_releasedBy FOREIGN KEY (releasedBy)
        REFERENCES User(userID)
        ON DELETE SET NULL ON UPDATE CASCADE
);


-- Table Contract
CREATE TABLE Contract (
    contractID INT AUTO_INCREMENT PRIMARY KEY,
    bookingID INT NOT NULL,
    version INT NOT NULL DEFAULT 1,
    isActive BOOLEAN DEFAULT TRUE,
    fileOriginalUrl VARCHAR(255),
    filePartnerSignedUrl VARCHAR(255),
    fileCustomerSignedUrl VARCHAR(255),
    partnerSignedAt DATETIME NULL,
    customerSignedAt DATETIME NULL,
    status TINYINT UNSIGNED NOT NULL DEFAULT 0,
    -- 0: PENDING           (vừa generate)
    -- 1: PARTNER_UPLOADED  (partner đã upload bản ký)
    -- 2: CUSTOMER_UPLOADED (customer đã upload bản ký → hoàn tất)
    -- 3: CANCELLED         (hủy)
    -- 4: SUPERSEDED        (bị thay thế)
    note VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bookingID) REFERENCES Booking(bookingID) ON DELETE CASCADE
);

-- Table Review
CREATE TABLE Review (
    reviewID INT AUTO_INCREMENT PRIMARY KEY,
    bookingID INT NOT NULL,
    customerID INT NOT NULL,
    rating INT CHECK(rating BETWEEN 1 AND 5),
    comment TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bookingID) REFERENCES Booking(bookingID) ON DELETE CASCADE,
    FOREIGN KEY (customerID) REFERENCES Customer(customerID) ON DELETE CASCADE,
    UNIQUE (bookingID, customerID)
);

-- Table Report
CREATE TABLE Report (
    reportID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,                  -- người gửi report
    restaurantID INT NULL,                -- có thể NULL nếu target là review
    reviewID INT NULL,

    targetType TINYINT UNSIGNED NOT NULL,          -- 0: RESTAURANT, 1: REVIEW
    reasonType TINYINT UNSIGNED NOT NULL,          -- mã lý do, khác nhau theo loại

    content VARCHAR(255),
    status TINYINT NOT NULL DEFAULT 0,    -- 0: PENDING, 1: CONFIRMED, 2: REJECTED
    seen BIT DEFAULT 0,

    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE,
    FOREIGN KEY (restaurantID) REFERENCES Restaurant(restaurantID) ON DELETE CASCADE,
    FOREIGN KEY (reviewID) REFERENCES Review(reviewID) ON DELETE SET NULL
);

-- Table SystemSetting
CREATE TABLE SystemSetting (
    settingID INT AUTO_INCREMENT PRIMARY KEY,
    category TINYINT UNSIGNED NOT NULL,         -- 0: General, 1: Booking, 2: Payment, 3: Commission, 4: Notification, ...
    settingKey VARCHAR(100) NOT NULL UNIQUE, -- Mã key duy nhất, vd: 'DEFAULT_COMMISSION_RATE', 'REFUND_POLICY_DAYS'
    settingName VARCHAR(255) NOT NULL,      -- Tên hiển thị (vd: "Tỷ lệ hoa hồng mặc định")
    settingValue VARCHAR(255) NOT NULL,     -- Giá trị lưu (string để dễ parse kiểu)
    dataType TINYINT UNSIGNED NOT NULL DEFAULT 0, 	-- 0: STRING, 1: NUMBER, 2: BOOLEAN, 3: JSON, 4: DATE,...
    description VARCHAR(500),               -- Mô tả setting
    isActive BIT DEFAULT 1,                 -- Cho phép bật/tắt setting
    createdBy INT,
    updatedBy INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_systemsetting_createdBy FOREIGN KEY (createdBy)
        REFERENCES User(userID) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_systemsetting_updatedBy FOREIGN KEY (updatedBy)
        REFERENCES User(userID) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Lọc theo customer
CREATE INDEX idx_booking_customer ON Booking(customerID);

-- Lọc theo eventType
CREATE INDEX idx_booking_eventType ON Booking(eventTypeID);

-- Lọc theo trạng thái
CREATE INDEX idx_booking_status ON Booking(status);

-- Restaurant
CREATE INDEX idx_restaurant_partner ON Restaurant(restaurantPartnerID);
CREATE INDEX idx_restaurant_address ON Restaurant(addressID);
CREATE INDEX idx_restaurant_status ON Restaurant(status);

-- Hall
CREATE INDEX idx_hall_restaurant ON Hall(restaurantID);
CREATE INDEX idx_hall_status ON Hall(status);

-- Menu
CREATE INDEX idx_menu_restaurant ON Menu(restaurantID);
CREATE INDEX idx_menu_status ON Menu(status);

-- Service
CREATE INDEX idx_service_rest_event ON Service(restaurantID, eventTypeID);
CREATE INDEX idx_service_status ON Service(status);

-- Promotion
CREATE INDEX idx_promotion_restaurant ON Promotion(restaurantID);
CREATE INDEX idx_promotion_start_end ON Promotion(startDate, endDate);
CREATE INDEX idx_promotion_status ON Promotion(status);

-- EventType
CREATE INDEX idx_eventType_status ON EventType(status);

-- Many-to-many
CREATE INDEX idx_restaurantEventType_restaurant ON RestaurantEventType(restaurantID);
CREATE INDEX idx_restaurantEventType_eventType ON RestaurantEventType(eventTypeID);

CREATE INDEX idx_restaurantAmenities_restaurant ON RestaurantAmenities(restaurantID);
CREATE INDEX idx_restaurantAmenities_amenity ON RestaurantAmenities(amenityID);

CREATE INDEX idx_dishMenu_menu ON DishMenu(menuID);
CREATE INDEX idx_dishMenu_dish ON DishMenu(dishID);

-- Payment
CREATE INDEX idx_payment_booking ON Payment(bookingID);
CREATE INDEX idx_payment_restaurant ON Payment(restaurantID);
CREATE INDEX idx_payment_status ON Payment(status);

-- RefundPolicy
CREATE INDEX idx_refundpolicy_restaurant ON RefundPolicy(restaurantId);

-- Payouts
CREATE INDEX idx_payout_payment ON Payouts(paymentId);
CREATE INDEX idx_payout_restaurantPartner ON Payouts(restaurantPartnerId);
CREATE INDEX idx_payout_status ON Payouts(status);

-- Contract
CREATE INDEX idx_contract_booking ON Contract(bookingID);
CREATE INDEX idx_contract_status ON Contract(status);

-- Review
CREATE INDEX idx_review_booking ON Review(bookingID);
CREATE INDEX idx_review_customer ON Review(customerID);
CREATE INDEX idx_review_rating ON Review(rating);

-- Report
CREATE INDEX idx_report_user ON Report(userID);
CREATE INDEX idx_report_restaurant ON Report(restaurantID);
CREATE INDEX idx_report_review ON Report(reviewID);
CREATE INDEX idx_report_status ON Report(status);

-- Hall: filter theo số bàn, giá, status
CREATE INDEX idx_hall_capacity_price_status ON Hall(
    minTable,
    maxTable,
    price,
    status
);

-- Booking: check xem sảnh đã có booking nào trùng ngày/giờ
CREATE INDEX idx_booking_hall_datetime ON Booking(
    hallID,
    eventDate,
    startTime,
    endTime,
    status
);

-- Restaurant: filter theo địa chỉ và active
CREATE INDEX idx_restaurant_address_status ON Restaurant(
    addressID,
    status
);

-- Address: tìm theo từ khóa
ALTER TABLE Address ADD FULLTEXT INDEX idx_address_fulltext(fullAddress);

-- RestaurantEventType: filter nhà hàng có loại tiệc đó
CREATE INDEX idx_restaurant_eventtype ON RestaurantEventType(
    restaurantID,
    eventTypeID
);

-- Insert SystemSetting
INSERT INTO SystemSetting (category, settingKey, settingName, settingValue, dataType, description)
VALUES
(3, 'DEFAULT_COMMISSION_RATE', 'Tỷ lệ hoa hồng mặc định', '0.10', 1, 'Áp dụng cho chủ nhà hàng mới được duyệt'),
(2, 'REFUND_POLICY_DAYS', 'Số ngày hoàn tiền tối đa', '7', 1, 'Số ngày tối đa khách hàng có thể yêu cầu hoàn tiền'),
(1, 'MIN_BOOKING_NOTICE_HOURS', 'Thời gian đặt tiệc tối thiểu (giờ)', '48', 1, 'Phải đặt trước ít nhất 48 giờ'),
(0, 'ENABLE_PROMOTIONS', 'Cho phép hiển thị khuyến mãi', 'true', 2, 'Bật/tắt module khuyến mãi'),
(4, 'EMAIL_SENDER', 'Địa chỉ email hệ thống', 'noreply@weddinghub.vn', 0, 'Email gửi thông báo hệ thống'),
(2, 'VAT_RATE', 'Thuế giá trị gia tăng mặc định', '0.08', 1, 'Thuế VAT mặc định 8% áp dụng cho các giao dịch'),
(1, 'BOOKING_DEPOSIT_PERCENTAGE', 'Tỷ lệ tiền cọc khi khách đặt tiệc', '0.30', 1, 'Khách cần đặt cọc 30% tổng giá trị tiệc khi xác nhận booking'),
(1, 'DEFAULT_MIN_GAP_HOURS', 'Thời gian cách giữa 2 tiệc', '3', 1, 'Khoảng cách tối thiểu giữa 2 booking cùng sảnh'),
(1, 'DEFAULT_MIN_BOOKING_NOTICE_HOURS', 'Thời gian đặt trước tối thiểu', '48', 1, 'Khách phải đặt trước ít nhất 48 giờ');

-- Insert EventType
INSERT INTO EventType (name) VALUES
('Tiệc cưới'),
('Tiệc sinh nhật'),
('Tiệc công ty'),
('Tiệc tất niên'),
('Tiệc khai trương'),
('Lễ kỷ niệm'),
('Liên hoan'),
('Sự kiện');

-- Insert Amenity
INSERT INTO Amenity (name) VALUES
('Máy lạnh'),
('Hệ thống âm thanh'),
('Hệ thống ánh sáng'),
('Hệ thống micro không dây'),
('Bãi giữ xe'),
('Wi-Fi miễn phí'),
('Phòng chờ cô dâu'),
('Phòng thay đồ'),
('Nhà vệ sinh riêng'),
('Bục cake & champagne riêng'),
('Khu vực chụp ảnh'),
('Khu vực hút thuốc riêng'),
('Máy phát điện dự phòng'),
('Điều hòa trung tâm'),
('Thang máy'),
('Lối thoát hiểm'),
('Hồ bơi'),
('Camera an ninh'),
('Bục ký tên lễ tân'),
('Thảm đỏ lối vào'),
('Hoa tươi bàn tiệc cơ bản'),
('Thực đơn in sẵn trên bàn');

-- Insert EventType
INSERT INTO EventType (name) VALUES
('Tiệc cưới'),
('Tiệc sinh nhật'),
('Tiệc công ty'),
('Tiệc tất niên'),
('Tiệc khai trương'),
('Lễ kỷ niệm'),
('Liên hoan'),
('Sự kiện');



-- 2️⃣ Tạo User cho Customer
INSERT INTO User (email, fullName, phone, password, role)
VALUES ('customer1@test.com', 'Khách Hàng Test', '0123456789', '123456', 0);
SET @customerUserID = LAST_INSERT_ID();

INSERT INTO Customer (customerID, weddingRole, partnerName)
VALUES (@customerUserID, 0, 'Bạn Đời Test');

-- 3️⃣ Tạo User cho Restaurant Partner
INSERT INTO User (email, fullName, phone, password, role)
VALUES ('gonthinh7@gmail.com', 'Nhà Hàng Thịnh', '0988888888', '123456', 1);
SET @partnerUserID = LAST_INSERT_ID();

INSERT INTO RestaurantPartner (restaurantPartnerID, licenseUrl, status, commissionRate)
VALUES (@partnerUserID, 'license.pdf', 3, 0.10);

-- 4️⃣ Address
INSERT INTO Address (number, street, ward)
VALUES ('12', 'Lê Lợi', 'Phường 5');
SET @addressID = LAST_INSERT_ID();

-- 5️⃣ Restaurant
INSERT INTO Restaurant (restaurantPartnerID, name, description, hallCount, addressID, thumbnailURL)
VALUES (@partnerUserID, 'Nhà Hàng Hoa Sen', 'Nhà hàng chuyên tổ chức tiệc cưới sang trọng.', 1, @addressID, 'https://dummyimage.com/600x400');
SET @restaurantID = LAST_INSERT_ID();

-- 6️⃣ Hall
INSERT INTO Hall (restaurantID, name, description, minTable, maxTable, area, price)
VALUES (@restaurantID, 'Sảnh A', 'Sảnh chính rộng rãi.', 10, 30, 500, 10000000);
SET @hallID = LAST_INSERT_ID();

-- 7️⃣ Menu
INSERT INTO Menu (restaurantID, name, price, imageURL)
VALUES (@restaurantID, 'Menu Tiệc Cưới Đặc Biệt', 5000000, 'https://dummyimage.com/300x300');
SET @menuID = LAST_INSERT_ID();


select * From User;
select * From event;
SELECT * FROM Menu;

SELECT hallID, name, price FROM Hall;
SELECT menuID, menuName, pricePerTable FROM Menu;


Use weddingrestaurantmanagement;
