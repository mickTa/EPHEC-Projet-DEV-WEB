-- Reset tables
DROP TABLE IF EXISTS "users";

-- Initialize tables
CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "activated" BOOLEAN DEFAULT FALSE,
  "fullName" VARCHAR(255) DEFAULT NULL,
  "email" VARCHAR(255) DEFAULT NULL,
  "password" VARCHAR(255) DEFAULT NULL,
  "birthday" VARCHAR(255) DEFAULT NULL,
  "role" VARCHAR(10) CHECK ("role" IN ('USER', 'ADMIN', 'ORGANIZER')) DEFAULT 'USER',
  "paymentURL" VARCHAR(255) DEFAULT NULL,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL
);

DROP TABLE IF EXISTS "events";

CREATE TABLE "events" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "organizerId" INT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "startDate" TIMESTAMP NOT NULL,
  "endDate" TIMESTAMP NOT NULL,
  "address" VARCHAR(255),
  "description" VARCHAR(511)
);

-- Insert test data
INSERT INTO "users" ("id", "activated", "fullName", "email", "password", "birthday", "role", "paymentURL", "createdAt", "updatedAt")
VALUES
(1, TRUE, 'John Doe', 'john.doe@example.com', 'hashed_password_123', '1990-01-01', 'USER', NULL, '2023-01-01 12:00:00', '2023-01-01 12:00:00'),
(2, TRUE, 'Jane Smith', 'jane.smith@example.com', 'hashed_password_456', '1985-05-15', 'ADMIN', NULL, '2023-01-02 12:00:00', '2023-01-02 12:00:00'),
(3, FALSE, 'Alice Johnson', 'alice.johnson@example.com', 'hashed_password_789', '1995-07-20', 'ORGANIZER', NULL, '2023-01-03 12:00:00', '2023-01-03 12:00:00');


INSERT INTO "events" ("id", "name", "organizerId", "startDate", "endDate", "address", "description")
VALUES
(1, 'Tech Conference 2023', 3, '2023-06-01 09:00:00', '2023-06-01 17:00:00', '123 Tech St, Silicon Valley, CA', 'A conference about the latest in tech.'),
(2, 'Music Festival 2023', 3, '2023-07-15 12:00:00', '2023-07-16 23:00:00', '456 Music Ave, Nashville, TN', 'A festival featuring various artists.'),
(3, 'Art Exhibition 2023', 3, '2023-08-10 10:00:00', '2023-08-10 18:00:00', '789 Art Blvd, New York, NY', 'An exhibition showcasing local artists.');
-- Ensure the sequence for SERIAL is correct
SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM "users"), 1), false);

-- Drop table if it exists
DROP TABLE IF EXISTS "wallets";

CREATE TABLE "wallets" (
  "id" SERIAL PRIMARY KEY,
  "userId" INT REFERENCES "users"("id") ON DELETE CASCADE,
  "organizerId" INT REFERENCES "users"("id") ON DELETE CASCADE,
  "amount" DECIMAL(10,2) DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE ("userId", "organizerId") -- Ensures a user can't register twice for the same event
);
