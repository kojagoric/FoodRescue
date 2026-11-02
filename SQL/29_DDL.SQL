
-- FoodRescue: Surplus Food Redistribution and Expiry Tracking System


CREATE DATABASE foodrescue;
Use FoodRescue;

CREATE TABLE DONOR (
    donor_id        INT AUTO_INCREMENT PRIMARY KEY,
    Name            VARCHAR(100) NOT NULL,
    Donor_Type      VARCHAR(50),
    Contact_Person  VARCHAR(100),
    Phone_No        VARCHAR(15),
    Email           VARCHAR(100),
    Street          VARCHAR(100),
    City            VARCHAR(50),
    State           VARCHAR(50),
    Country         VARCHAR(50)
);


CREATE TABLE RECIPIENT_ORGANIZATION (
    recipient_id       INT AUTO_INCREMENT PRIMARY KEY,
    Organization_Name  VARCHAR(100) NOT NULL,
    Organization_Type  VARCHAR(50),
    Contact_Person     VARCHAR(100),
    Phone_No           VARCHAR(15),
    Email              VARCHAR(100),
    Street             VARCHAR(100),
    City               VARCHAR(50),
    State              VARCHAR(50),
    Country            VARCHAR(50)
);


CREATE TABLE FOOD_BATCH (
    batch_id          INT AUTO_INCREMENT PRIMARY KEY,
    donor_id          INT NOT NULL,
    Food_Name         VARCHAR(100) NOT NULL,
    Food_Category     VARCHAR(50),
    Quantity          DECIMAL(10,2) NOT NULL,
    Unit              VARCHAR(20),
    Condition_Status  VARCHAR(50),
    Production_Date   DATE,
    Expiry_Date       DATE NOT NULL,
    Batch_Status      VARCHAR(30) DEFAULT 'Available',
    CONSTRAINT fk_foodbatch_donor
        FOREIGN KEY (donor_id) REFERENCES DONOR(donor_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_batch_status
        CHECK (Batch_Status IN ('Available','Reserved','Collected','Expired')),
    CONSTRAINT chk_quantity_positive
        CHECK (Quantity > 0)
);

CREATE TABLE COLLECTION_REQUEST (
    request_id             INT AUTO_INCREMENT PRIMARY KEY,
    batch_id               INT NOT NULL,
    recipient_id           INT NOT NULL,
    Requested_Quantity     DECIMAL(10,2) NOT NULL,
    Request_Date           DATE NOT NULL,
    Preferred_Pickup_Time  DATETIME,
    Request_Status         VARCHAR(30) DEFAULT 'Pending',
    Notes                  VARCHAR(255),
    CONSTRAINT fk_request_batch
        FOREIGN KEY (batch_id) REFERENCES FOOD_BATCH(batch_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_request_recipient
        FOREIGN KEY (recipient_id) REFERENCES RECIPIENT_ORGANIZATION(recipient_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_request_status
        CHECK (Request_Status IN ('Pending','Approved','Rejected','Completed')),
    CONSTRAINT chk_requested_qty_positive
        CHECK (Requested_Quantity > 0)
);


CREATE TABLE TRANSPORTATION (
    transport_id      INT AUTO_INCREMENT PRIMARY KEY,
    request_id        INT NOT NULL,
    Driver_Name       VARCHAR(100),
    Vehicle_Number    VARCHAR(20),
    Pickup_Time       DATETIME,
    Delivery_Time     DATETIME,
    Transport_Status  VARCHAR(30) DEFAULT 'Scheduled',
    CONSTRAINT fk_transport_request
        FOREIGN KEY (request_id) REFERENCES COLLECTION_REQUEST(request_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_transport_status
        CHECK (Transport_Status IN ('Scheduled','In_Transit','Delivered','Cancelled'))
);


CREATE TABLE DISTRIBUTION (
    distribution_id       INT AUTO_INCREMENT PRIMARY KEY,
    request_id            INT NOT NULL,
    recipient_id          INT NOT NULL,
    Distributed_Quantity  DECIMAL(10,2) NOT NULL,
    Distribution_Date     DATE NOT NULL,
    Distribution_Status   VARCHAR(30) DEFAULT 'Completed',
    Received_By           VARCHAR(100),
    CONSTRAINT fk_distribution_request
        FOREIGN KEY (request_id) REFERENCES COLLECTION_REQUEST(request_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_distribution_recipient
        FOREIGN KEY (recipient_id) REFERENCES RECIPIENT_ORGANIZATION(recipient_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_distribution_status
        CHECK (Distribution_Status IN ('Pending','Completed','Partially_Completed')),
    CONSTRAINT chk_distributed_qty_positive
        CHECK (Distributed_Quantity > 0)
);


CREATE VIEW FOOD_BATCH_EXPIRY_VIEW AS
SELECT
    batch_id,
    donor_id,
    Food_Name,
    Expiry_Date,
    DATEDIFF(Expiry_Date, CURDATE()) AS Days_To_Expiry
FROM FOOD_BATCH;

