-- FoodRescue sample data
-- Run AFTER 29_DDL.SQL has successfully created the six tables.
-- This script assumes the tables are empty and uses explicit IDs for reproducibility.

USE foodrescue;
START TRANSACTION;

INSERT INTO DONOR
(donor_id, Name, Donor_Type, Contact_Person, Phone_No, Email, Street, City, State, Country)
VALUES
(1, 'GreenHarvest Farms', 'Farm', 'Arjun Rao', '9876501001', 'arjun@greenharvest.example', '12 Farm Road', 'Bengaluru', 'Karnataka', 'India'),
(2, 'FreshMart Supermarket', 'Retailer', 'Meera Shah', '9876501002', 'meera@freshmart.example', '44 Market Street', 'Bengaluru', 'Karnataka', 'India'),
(3, 'Sunrise Bakery', 'Bakery', 'Rohan Das', '9876501003', 'rohan@sunrisebakery.example', '8 Church Street', 'Bengaluru', 'Karnataka', 'India'),
(4, 'Campus Canteen', 'Institution', 'Nisha Menon', '9876501004', 'nisha@campuscanteen.example', 'PES Campus Road', 'Bengaluru', 'Karnataka', 'India'),
(5, 'DairyPure Cooperative', 'Dairy', 'Kiran Patel', '9876501005', 'kiran@dairypure.example', '6 Dairy Lane', 'Bengaluru', 'Karnataka', 'India');

INSERT INTO RECIPIENT_ORGANIZATION
(recipient_id, Organization_Name, Organization_Type, Contact_Person, Phone_No, Email, Street, City, State, Country)
VALUES
(1, 'Hope Community Kitchen', 'Community Kitchen', 'Anita Joseph', '9887602001', 'anita@hopekitchen.example', '10 Service Road', 'Bengaluru', 'Karnataka', 'India'),
(2, 'CareHome Foundation', 'NGO', 'Vikram Singh', '9887602002', 'vikram@carehome.example', '21 Lake View', 'Bengaluru', 'Karnataka', 'India'),
(3, 'Shanti Shelter', 'Shelter', 'Pooja Nair', '9887602003', 'pooja@shantishelter.example', '5 Shelter Road', 'Bengaluru', 'Karnataka', 'India'),
(4, 'LittleSteps Orphanage', 'Orphanage', 'Rahul Bose', '9887602004', 'rahul@littlesteps.example', '17 Garden Street', 'Bengaluru', 'Karnataka', 'India'),
(5, 'PeopleFirst Food Bank', 'Food Bank', 'Sana Khan', '9887602005', 'sana@peoplefirst.example', '3 Unity Avenue', 'Bengaluru', 'Karnataka', 'India');

INSERT INTO FOOD_BATCH
(batch_id, donor_id, Food_Name, Food_Category, Quantity, Unit, Condition_Status, Production_Date, Expiry_Date, Batch_Status)
VALUES
(1, 1, 'Tomatoes', 'Vegetables', 100.00, 'kg', 'Fresh', '2026-10-28', '2026-11-05', 'Available'),
(2, 1, 'Spinach', 'Vegetables', 50.00, 'kg', 'Fresh', '2026-10-30', '2026-11-03', 'Reserved'),
(3, 2, 'Packaged Rice', 'Grains', 80.00, 'kg', 'Good', '2026-09-01', '2027-03-01', 'Collected'),
(4, 2, 'Apples', 'Fruits', 60.00, 'kg', 'Good', '2026-10-27', '2026-11-08', 'Available'),
(5, 3, 'Bread Loaves', 'Bakery', 40.00, 'pieces', 'Fresh', '2026-10-31', '2026-11-02', 'Collected'),
(6, 4, 'Cooked Vegetable Meals', 'Prepared Food', 30.00, 'packs', 'Fresh', '2026-10-30', '2026-10-31', 'Expired'),
(7, 5, 'Milk', 'Dairy', 25.00, 'litres', 'Refrigerated', '2026-10-31', '2026-11-02', 'Reserved'),
(8, 3, 'Buns', 'Bakery', 100.00, 'pieces', 'Fresh', '2026-10-31', '2026-11-04', 'Available');

INSERT INTO COLLECTION_REQUEST
(request_id, batch_id, recipient_id, Requested_Quantity, Request_Date, Preferred_Pickup_Time, Request_Status, Notes)
VALUES
(1, 1, 1, 30.00, '2026-10-29', '2026-11-01 09:00:00', 'Approved', 'Priority for community lunch'),
(2, 1, 2, 20.00, '2026-10-30', '2026-11-01 10:00:00', 'Pending', 'Awaiting confirmation'),
(3, 2, 3, 25.00, '2026-10-30', '2026-11-01 11:00:00', 'Approved', 'Collect in refrigerated containers'),
(4, 3, 5, 40.00, '2026-10-28', '2026-10-30 08:30:00', 'Completed', 'Dry goods collection'),
(5, 4, 4, 15.00, '2026-10-30', '2026-11-02 09:30:00', 'Approved', 'Select undamaged apples'),
(6, 5, 1, 20.00, '2026-10-31', '2026-11-01 07:30:00', 'Completed', 'Same-day bakery pickup'),
(7, 7, 2, 10.00, '2026-10-31', '2026-11-01 08:00:00', 'Pending', 'Maintain cold chain'),
(8, 8, 5, 50.00, '2026-10-31', '2026-11-02 08:00:00', 'Rejected', 'Recipient storage unavailable');

INSERT INTO TRANSPORTATION
(transport_id, request_id, Driver_Name, Vehicle_Number, Pickup_Time, Delivery_Time, Transport_Status)
VALUES
(1, 1, 'Suresh Kumar', 'KA01AB1234', '2026-11-01 09:10:00', NULL, 'In_Transit'),
(2, 3, 'Divya Rao', 'KA03CD5678', '2026-11-01 11:05:00', NULL, 'Scheduled'),
(3, 4, 'Manoj Nair', 'KA05EF9012', '2026-10-30 08:40:00', '2026-10-30 09:25:00', 'Delivered'),
(4, 5, 'Asha Reddy', 'KA02GH3456', '2026-11-02 09:35:00', NULL, 'Scheduled'),
(5, 6, 'Imran Ali', 'KA04JK7890', '2026-11-01 07:40:00', '2026-11-01 08:20:00', 'Delivered');

INSERT INTO DISTRIBUTION
(distribution_id, request_id, recipient_id, Distributed_Quantity, Distribution_Date, Distribution_Status, Received_By)
VALUES
(1, 4, 5, 40.00, '2026-10-30', 'Completed', 'Sana Khan'),
(2, 6, 1, 15.00, '2026-11-01', 'Partially_Completed', 'Anita Joseph');

COMMIT;

-- Quick row-count check after insertion:
SELECT 'DONOR' AS table_name, COUNT(*) AS row_count FROM DONOR
UNION ALL SELECT 'RECIPIENT_ORGANIZATION', COUNT(*) FROM RECIPIENT_ORGANIZATION
UNION ALL SELECT 'FOOD_BATCH', COUNT(*) FROM FOOD_BATCH
UNION ALL SELECT 'COLLECTION_REQUEST', COUNT(*) FROM COLLECTION_REQUEST
UNION ALL SELECT 'TRANSPORTATION', COUNT(*) FROM TRANSPORTATION
UNION ALL SELECT 'DISTRIBUTION', COUNT(*) FROM DISTRIBUTION;
