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
    role VARCHAR(20) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    status BIT DEFAULT 1,
    CHECK (role IN ('CUSTOMER', 'OWNER', 'ADMIN'))
);

-- Table Customer
CREATE TABLE Customer (
    customerID INT PRIMARY KEY,
    weddingRole VARCHAR(20) NOT NULL,
    partnerName VARCHAR(255),
    FOREIGN KEY (customerID) REFERENCES User(userID) ON DELETE CASCADE,
    CHECK (weddingRole IN ('BRIDE', 'GROOM', 'OTHER'))
);

-- Table Owner
CREATE TABLE Owner (
    ownerID INT PRIMARY KEY,
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
    status BIT DEFAULT 1,
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
    status BIT DEFAULT 1,
    FOREIGN KEY (ownerID) REFERENCES Owner(ownerID) ON DELETE CASCADE
);

-- Table Amenity
CREATE TABLE Amenity (
    amenityID INT AUTO_INCREMENT PRIMARY KEY,
    restaurantID INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    status BIT DEFAULT 1,
    FOREIGN KEY (restaurantID) REFERENCES Restaurant(restaurantID) ON DELETE CASCADE
);

-- Table Hall
CREATE TABLE Hall (
    hallID INT AUTO_INCREMENT PRIMARY KEY,
    restaurantID INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    area DECIMAL(5,2) NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    status BIT DEFAULT 1,
    occupied BIT DEFAULT 0,
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
    status BIT DEFAULT 1,
    FOREIGN KEY (restaurantID) REFERENCES Restaurant(restaurantID) ON DELETE CASCADE
);

-- Table DishCategory
CREATE TABLE DishCategory (
    categoryID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    requiredQuantity INT DEFAULT 1 CHECK(requiredQuantity > 0),
    status BIT DEFAULT 1
);

-- Table Dish
CREATE TABLE Dish (
    dishID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    categoryID INT NOT NULL,
    status BIT DEFAULT 1,
    FOREIGN KEY (categoryID) REFERENCES DishCategory(categoryID) ON DELETE CASCADE
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
    status BIT DEFAULT 1,
    FOREIGN KEY (restaurantID) REFERENCES Restaurant(restaurantID) ON DELETE CASCADE
);

-- Table Promotion
CREATE TABLE Promotion (
    promotionID INT AUTO_INCREMENT PRIMARY KEY,
    restaurantID INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    minTable INT DEFAULT 1 CHECK(minTable >= 0),
    discountType VARCHAR(20),
    discountValue DECIMAL(15,2) CHECK(discountValue >= 0),
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    status BIT DEFAULT 1,
    FOREIGN KEY (restaurantID) REFERENCES Restaurant(restaurantID) ON DELETE CASCADE,
    CHECK (discountType IN ('PERCENT','FREE')),
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
    status VARCHAR(20) DEFAULT 'PENDING',
    totalAmount DECIMAL(15,2) NOT NULL,
    discountAmount DECIMAL(15,2) DEFAULT 0,
    finalPrice DECIMAL(15,2) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    checked BIT DEFAULT 0,
    FOREIGN KEY (customerID) REFERENCES Customer(customerID) ON DELETE CASCADE,
    FOREIGN KEY (hallID) REFERENCES Hall(hallID) ON DELETE CASCADE,
    FOREIGN KEY (menuID) REFERENCES Menu(menuID) ON DELETE CASCADE,
    CHECK (status IN ('PENDING','CONFIRMED','CANCELLED', 'DEPOSITED', 'COMPLETED'))
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
    type VARCHAR(20) NOT NULL,
    paymentMethod VARCHAR(50),
    status VARCHAR(20) DEFAULT 'PENDING',
    vnp VARCHAR(255),
    paymentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    commissionRate DECIMAL(5,2) DEFAULT 0 CHECK(commissionRate >=0),
    commissionAmount DECIMAL(15,2) DEFAULT 0 CHECK(commissionAmount >=0),
    ownerAmount DECIMAL(15,2) DEFAULT 0 CHECK(ownerAmount >=0),
    FOREIGN KEY (bookingID) REFERENCES Booking(bookingID) ON DELETE CASCADE,
    CHECK (type IN ('DEPOSIT','REMAINING')),
    CHECK (status IN ('PENDING','CONFIRMED','FAILED', 'EXPIRED', 'CANCELLED'))
);

-- Table ExtraService
CREATE TABLE ExtraService (
    extraServiceID INT AUTO_INCREMENT PRIMARY KEY,
    bookingID INT NOT NULL,
    serviceID INT,
    customName VARCHAR(255),
    quantity INT DEFAULT 1 CHECK(quantity >0),
    unitPrice DECIMAL(15,2) DEFAULT 0 CHECK(unitPrice >=0),
    unit VARCHAR(50),
    totalPrice DECIMAL(15,2) DEFAULT 0 CHECK(totalPrice >=0),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bookingID) REFERENCES Booking(bookingID) ON DELETE CASCADE,
    FOREIGN KEY (serviceID) REFERENCES Service(serviceID) ON DELETE CASCADE,
    CHECK (serviceID IS NOT NULL OR customName IS NOT NULL)
);

-- Table Contract
CREATE TABLE Contract (
    contractID INT AUTO_INCREMENT PRIMARY KEY,
    bookingID INT NOT NULL UNIQUE,
    content LONGTEXT,
    signedAt DATETIME,
    ownerSignature VARCHAR(255),
    customerSignature VARCHAR(255),
    status VARCHAR(20) DEFAULT 'PENDING',
    FOREIGN KEY (bookingID) REFERENCES Booking(bookingID) ON DELETE CASCADE,
    CHECK (status IN ('PENDING','SIGNED','CANCELLED'))
);

-- Table Review
CREATE TABLE Review (
    reviewID INT AUTO_INCREMENT PRIMARY KEY,
    bookingID INT NOT NULL UNIQUE,
    rating INT CHECK(rating BETWEEN 1 AND 5),
    comment VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bookingID) REFERENCES Booking(bookingID) ON DELETE CASCADE
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
    status VARCHAR(20) DEFAULT 'PENDING',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    seen BIT DEFAULT 0,
    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE,
    FOREIGN KEY (restaurantID) REFERENCES Restaurant(restaurantID) ON DELETE CASCADE,
    FOREIGN KEY (reviewID) REFERENCES Review(reviewID) ON DELETE SET NULL,
    CHECK (reviewID IS NOT NULL OR targetType = 'RESTAURANT'),
    CHECK (targetType IN ('RESTAURANT','REVIEW')),
    CHECK (
        (targetType = 'RESTAURANT' AND reasonType IN ('FAKE_INFO','SPAM','FRAUD','INAPPROPRIATE','OTHER'))
        OR
        (targetType = 'REVIEW' AND reasonType IN ('FAKE_REVIEW','SPAM','INAPPROPRIATE','IRRELEVANT','OTHER'))
    ),
    CHECK (status IN ('PENDING','CONFIRMED','REJECTED'))
);

