-- FoodRescue validation and demo queries
USE foodrescue;

-- A. Confirm all six tables exist.
SHOW TABLES;

-- B. Inspect table structures.
DESCRIBE DONOR;
DESCRIBE RECIPIENT_ORGANIZATION;
DESCRIBE FOOD_BATCH;
DESCRIBE COLLECTION_REQUEST;
DESCRIBE TRANSPORTATION;
DESCRIBE DISTRIBUTION;

-- C. Confirm inserted sample records.
SELECT * FROM DONOR;
SELECT * FROM RECIPIENT_ORGANIZATION;
SELECT * FROM FOOD_BATCH;
SELECT * FROM COLLECTION_REQUEST;
SELECT * FROM TRANSPORTATION;
SELECT * FROM DISTRIBUTION;

-- D. Expiry tracking.
SELECT batch_id, Food_Name, Expiry_Date,
       DATEDIFF(Expiry_Date, CURDATE()) AS Days_To_Expiry,
       CASE
           WHEN Expiry_Date < CURDATE() THEN 'Expired'
           WHEN Expiry_Date <= DATE_ADD(CURDATE(), INTERVAL 3 DAY) THEN 'Expiring Soon'
           ELSE 'Safe'
       END AS Expiry_Alert
FROM FOOD_BATCH
ORDER BY Expiry_Date;

-- E. Requests with donor, food, and recipient information.
SELECT cr.request_id, d.Name AS Donor, fb.Food_Name,
       ro.Organization_Name AS Recipient,
       cr.Requested_Quantity, cr.Request_Status
FROM COLLECTION_REQUEST cr
JOIN FOOD_BATCH fb ON fb.batch_id = cr.batch_id
JOIN DONOR d ON d.donor_id = fb.donor_id
JOIN RECIPIENT_ORGANIZATION ro ON ro.recipient_id = cr.recipient_id
ORDER BY cr.request_id;

-- F. Total quantities requested by each recipient.
SELECT ro.Organization_Name,
       SUM(cr.Requested_Quantity) AS Total_Requested
FROM RECIPIENT_ORGANIZATION ro
LEFT JOIN COLLECTION_REQUEST cr ON cr.recipient_id = ro.recipient_id
GROUP BY ro.recipient_id, ro.Organization_Name
ORDER BY Total_Requested DESC;

-- G. Distribution summary.
SELECT ro.Organization_Name,
       COUNT(ds.distribution_id) AS Number_Of_Distributions,
       COALESCE(SUM(ds.Distributed_Quantity), 0) AS Total_Distributed
FROM RECIPIENT_ORGANIZATION ro
LEFT JOIN DISTRIBUTION ds ON ds.recipient_id = ro.recipient_id
GROUP BY ro.recipient_id, ro.Organization_Name;

-- H. Foreign-key orphan checks: each query should return zero rows.
SELECT fb.* FROM FOOD_BATCH fb
LEFT JOIN DONOR d ON d.donor_id = fb.donor_id
WHERE d.donor_id IS NULL;

SELECT cr.* FROM COLLECTION_REQUEST cr
LEFT JOIN FOOD_BATCH fb ON fb.batch_id = cr.batch_id
LEFT JOIN RECIPIENT_ORGANIZATION ro ON ro.recipient_id = cr.recipient_id
WHERE fb.batch_id IS NULL OR ro.recipient_id IS NULL;
