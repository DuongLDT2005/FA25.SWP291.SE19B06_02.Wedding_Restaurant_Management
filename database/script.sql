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
    role TINYINT NOT NULL, -- 0: CUSTOMER, 1: OWNER, 2: ADMIN
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    status BIT DEFAULT 1 -- 0: INACTIVE, 1: ACTIVE
);

-- Table Customer
CREATE TABLE Customer (
    customerID INT PRIMARY KEY,
    weddingRole TINYINT NOT NULL, -- 0: BRIDE, 1: GROOM, 2: OTHER
    partnerName VARCHAR(255),
    FOREIGN KEY (customerID) REFERENCES User(userID) ON DELETE CASCADE
);

-- Table Owner
CREATE TABLE Owner (
    ownerID INT PRIMARY KEY,
    licenseUrl VARCHAR(255) NOT NULL,
    status TINYINT NOT NULL DEFAULT 0, -- 0: pending, 1: rejected, 2: negotiating, 3: active, 4: inactive
	commissionRate DECIMAL(3,2) DEFAULT NULL CHECK (commissionRate >= 0 AND commissionRate <= 1),
    FOREIGN KEY (ownerID) REFERENCES User(userID) ON DELETE CASCADE
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
    ownerID INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    hallCount INT DEFAULT 0,
    addressID INT NOT NULL,
    thumbnailURL VARCHAR(255) NOT NULL,
    status BIT DEFAULT 1, -- 0: INACTIVE, 1: ACTIVE
    FOREIGN KEY (ownerID) REFERENCES Owner(ownerID) ON DELETE CASCADE,
    FOREIGN KEY (addressID) REFERENCES Address(addressID) ON DELETE CASCADE
);

-- Table RestaurantImage
CREATE TABLE RestaurantImage (
    imageID INT AUTO_INCREMENT PRIMARY KEY,
    restaurantID INT NOT NULL,
    imageURL VARCHAR(255) NOT NULL,
    FOREIGN KEY (restaurantID) REFERENCES Restaurant(restaurantID) ON DELETE CASCADE
);

-- Table BankAccount
CREATE TABLE BankAccount (
    accountID INT AUTO_INCREMENT PRIMARY KEY,
    ownerID INT NOT NULL,
    bankName VARCHAR(255) NOT NULL,
    accountNumber VARCHAR(255) NOT NULL,
    accountHolder VARCHAR(255) NOT NULL,
    branch VARCHAR(255),
    status BIT DEFAULT 1, -- 0: INACTIVE, 1: ACTIVE
    FOREIGN KEY (ownerID) REFERENCES Owner(ownerID) ON DELETE CASCADE
);

-- Table Amenity
CREATE TABLE Amenity (
    amenityID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
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
    description VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    area DECIMAL(7,2) NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    status BIT DEFAULT 1, -- 0: INACTIVE, 1: ACTIVE
    FOREIGN KEY (restaurantID) REFERENCES Restaurant(restaurantID) ON DELETE CASCADE
);

-- Table HallImage
CREATE TABLE HallImage (
    imageID INT AUTO_INCREMENT PRIMARY KEY,
    hallID INT NOT NULL,
    imageURL VARCHAR(255) NOT NULL,
    FOREIGN KEY (hallID) REFERENCES Hall(hallID) ON DELETE CASCADE
);

-- Table Menu
CREATE TABLE Menu (
    menuID INT AUTO_INCREMENT PRIMARY KEY,
    restaurantID INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    status BIT DEFAULT 1, -- 0: INACTIVE, 1: ACTIVE
    FOREIGN KEY (restaurantID) REFERENCES Restaurant(restaurantID) ON DELETE CASCADE
);

-- Table DishCategory
CREATE TABLE DishCategory (
    categoryID INT AUTO_INCREMENT PRIMARY KEY,
    restaurantID INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    requiredQuantity INT DEFAULT 1 CHECK(requiredQuantity > 0),
    status BIT DEFAULT 1, -- 0: INACTIVE, 1: ACTIVE
    FOREIGN KEY (restaurantID) REFERENCES Restaurant(restaurantID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table Dish
CREATE TABLE Dish (
    dishID INT AUTO_INCREMENT PRIMARY KEY,
    restaurantID INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    categoryID INT NOT NULL,
    status BIT DEFAULT 1, -- 0: INACTIVE, 1: ACTIVE
    FOREIGN KEY (categoryID) REFERENCES DishCategory(categoryID) ON DELETE CASCADE,
    FOREIGN KEY (restaurantID) REFERENCES Restaurant(restaurantID) ON DELETE CASCADE
);

-- Table DishMenu (many-to-many)
CREATE TABLE DishMenu (
    menuID INT NOT NULL,
    dishID INT NOT NULL,
    PRIMARY KEY (menuID, dishID),
    FOREIGN KEY (menuID) REFERENCES Menu(menuID) ON DELETE CASCADE,
    FOREIGN KEY (dishID) REFERENCES Dish(dishID) ON DELETE CASCADE
);

-- Table Service
CREATE TABLE Service (
    serviceID INT AUTO_INCREMENT PRIMARY KEY,
    restaurantID INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    unit VARCHAR(50),
    status BIT DEFAULT 1, -- 0: INACTIVE, 1: ACTIVE
    FOREIGN KEY (restaurantID) REFERENCES Restaurant(restaurantID) ON DELETE CASCADE
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
    FOREIGN KEY (restaurantID) REFERENCES Restaurant(restaurantID) ON DELETE CASCADE,
    CHECK (startDate <= endDate)
);

-- Table PromotionService (many-to-many)
CREATE TABLE PromotionService (
    promotionID INT NOT NULL,
    serviceID INT NOT NULL,
    PRIMARY KEY (promotionID, serviceID),
    FOREIGN KEY (promotionID) REFERENCES Promotion(promotionID) ON DELETE CASCADE,
    FOREIGN KEY (serviceID) REFERENCES Service(serviceID) ON DELETE CASCADE
);

-- Table Booking
CREATE TABLE Booking (
    bookingID INT AUTO_INCREMENT PRIMARY KEY,
    customerID INT NOT NULL,
    hallID INT NOT NULL,
    menuID INT NOT NULL,
    eventDate DATE NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    tableCount INT DEFAULT 1 CHECK(tableCount > 0),
    specialRequest VARCHAR(255),
    status TINYINT NOT NULL DEFAULT 0, -- 0: PENDING, 1: CONFIRMED, 2: CANCELLED, 3: DEPOSITED, 4: COMPLEDTED
    totalAmount DECIMAL(15,2) NOT NULL,
    discountAmount DECIMAL(15,2) DEFAULT 0,
    finalPrice DECIMAL(15,2) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    checked BIT DEFAULT 0, -- 0: CHECKED, 1: UNCHECKED
    FOREIGN KEY (customerID) REFERENCES Customer(customerID) ON DELETE CASCADE,
    FOREIGN KEY (hallID) REFERENCES Hall(hallID) ON DELETE CASCADE,
    FOREIGN KEY (menuID) REFERENCES Menu(menuID) ON DELETE CASCADE
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
    amount DECIMAL(15,2) NOT NULL CHECK(amount >= 0),
    type BIT DEFAULT 0, -- 0: DEPOSIT, 1: REMAINING
    paymentMethod VARCHAR(50),
    status TINYINT NOT NULL DEFAULT 0, -- 0: PENDING, 1: CONFIRMED, 2: FAILED, 3: EXPIRED, 4: CANCELLED
    transactionRef VARCHAR(255),
    paymentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    released bit DEFAULT 0,
    FOREIGN KEY (bookingID) REFERENCES Booking(bookingID) ON DELETE CASCADE
);

-- Table Payouts
CREATE TABLE Payouts (
    payoutId INT AUTO_INCREMENT PRIMARY KEY,
    paymentId INT NOT NULL,
    ownerId INT NOT NULL,
    grossAmount DECIMAL(15,2) NOT NULL CHECK (grossAmount >= 0),
    commission DECIMAL(15,2) NOT NULL CHECK (commission >= 0),
    netAmount DECIMAL(15,2) NOT NULL CHECK (netAmount >= 0),
    status TINYINT NOT NULL DEFAULT 0,   -- 0: pending, 1: paid, 2: failed
    transactionRef VARCHAR(100),
    releasedBy INT,   -- admin user ID
    releasedAt DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payout_payment FOREIGN KEY (paymentId)
        REFERENCES Payment(paymentID)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_payout_owner FOREIGN KEY (ownerId)
        REFERENCES Owner(ownerID)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_payout_releasedBy FOREIGN KEY (releasedBy)
        REFERENCES User(userID)
        ON DELETE SET NULL ON UPDATE CASCADE
);


-- Table Contract
CREATE TABLE Contract (
    contractID INT AUTO_INCREMENT PRIMARY KEY,
    bookingID INT NOT NULL UNIQUE,
    content LONGTEXT,
    signedAt DATETIME,
    ownerSignature VARCHAR(255),
    customerSignature VARCHAR(255),
    status TINYINT NOT NULL DEFAULT 0, -- 0: PENDING, 1: SIGNED, 2: CANCELLED
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
    userID INT NOT NULL,
    restaurantID INT NOT NULL,
    reviewID INT,
    targetType VARCHAR(20) NOT NULL,   
    reasonType VARCHAR(30) NOT NULL,  
    content VARCHAR(255),
    status TINYINT NOT NULL DEFAULT 0, -- 0: PENDING, 1: CONFIRMED, 2: REJECTED
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    seen BIT DEFAULT 0,
    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE,
    FOREIGN KEY (restaurantID) REFERENCES Restaurant(restaurantID) ON DELETE CASCADE,
    FOREIGN KEY (reviewID) REFERENCES Review(reviewID) ON DELETE SET NULL,
--     CHECK (reviewID IS NOT NULL OR targetType = 'RESTAURANT'),
    CHECK (targetType IN ('RESTAURANT','REVIEW')),
    CHECK (
        (targetType = 'RESTAURANT' AND reasonType IN ('FAKE_INFO','SPAM','FRAUD','INAPPROPRIATE','OTHER'))
        OR
        (targetType = 'REVIEW' AND reasonType IN ('FAKE_REVIEW','SPAM','INAPPROPRIATE','IRRELEVANT','OTHER'))
    )
);
