-- FoodRescue: advanced database concepts
-- Run AFTER 29_DDL.SQL and 30_INSERT_SAMPLE_DATA.SQL.
-- Targets MySQL 8.0+. Execute this file once (or re-run after dropping/replacing objects).

USE foodrescue;

-- 1. INDEX: helps expiry/status searches.
CREATE INDEX idx_food_batch_expiry_status
ON FOOD_BATCH (Expiry_Date, Batch_Status);

-- 2. VIEW: combines requests, recipient details, and food details.
CREATE OR REPLACE VIEW REQUEST_OVERVIEW AS
SELECT
    cr.request_id,
    cr.Request_Date,
    cr.Requested_Quantity,
    cr.Request_Status,
    fb.Food_Name,
    fb.Food_Category,
    fb.Expiry_Date,
    ro.Organization_Name AS Recipient_Name
FROM COLLECTION_REQUEST cr
JOIN FOOD_BATCH fb ON fb.batch_id = cr.batch_id
JOIN RECIPIENT_ORGANIZATION ro ON ro.recipient_id = cr.recipient_id;

-- 3. FUNCTION: calculates remaining days until a batch expires.
DROP FUNCTION IF EXISTS fn_days_until_expiry;
DELIMITER //
CREATE FUNCTION fn_days_until_expiry(p_expiry_date DATE)
RETURNS INT
NOT DETERMINISTIC
NO SQL
BEGIN
    RETURN DATEDIFF(p_expiry_date, CURDATE());
END//
DELIMITER ;

-- 4. STORED PROCEDURE: lists available food, optionally filtered by category.
DROP PROCEDURE IF EXISTS sp_available_food;
DELIMITER //
CREATE PROCEDURE sp_available_food(IN p_category VARCHAR(50))
BEGIN
    SELECT batch_id, Food_Name, Food_Category, Quantity, Unit, Expiry_Date,
           fn_days_until_expiry(Expiry_Date) AS Days_To_Expiry
    FROM FOOD_BATCH
    WHERE Batch_Status = 'Available'
      AND (p_category IS NULL OR Food_Category = p_category)
    ORDER BY Expiry_Date ASC;
END//
DELIMITER ;

-- 5. TRIGGER: prevents a distribution exceeding its request quantity.
DROP TRIGGER IF EXISTS trg_check_distribution_quantity;
DELIMITER //
CREATE TRIGGER trg_check_distribution_quantity
BEFORE INSERT ON DISTRIBUTION
FOR EACH ROW
BEGIN
    DECLARE v_requested_qty DECIMAL(10,2);
    SELECT Requested_Quantity
      INTO v_requested_qty
      FROM COLLECTION_REQUEST
     WHERE request_id = NEW.request_id;

    IF NEW.Distributed_Quantity > v_requested_qty THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Distributed quantity cannot exceed requested quantity';
    END IF;
END//
DELIMITER ;

-- Demonstrations:
SHOW INDEX FROM FOOD_BATCH;
SELECT * FROM REQUEST_OVERVIEW;
SELECT fn_days_until_expiry('2026-11-10') AS sample_days_remaining;
CALL sp_available_food(NULL);
CALL sp_available_food('Vegetables');

-- Trigger test (optional): this statement should FAIL because request 4 requested 40.
-- INSERT INTO DISTRIBUTION
-- (request_id, recipient_id, Distributed_Quantity, Distribution_Date, Distribution_Status, Received_By)
-- VALUES (4, 5, 999.00, CURDATE(), 'Completed', 'Test User');
