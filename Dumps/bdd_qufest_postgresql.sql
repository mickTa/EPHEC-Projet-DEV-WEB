-- Reset tables
DROP TABLE IF EXISTS "users";
DROP TABLE IF EXISTS "events";

-- Initialize tables
CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "activated" BOOLEAN DEFAULT FALSE,
  "fullName" VARCHAR(255) DEFAULT NULL,
  "email" VARCHAR(255) DEFAULT NULL,
  "password" VARCHAR(255) DEFAULT NULL,
  "birthday" VARCHAR(255) DEFAULT NULL,
  "role" VARCHAR(10) CHECK ("role" IN ('USER', 'ADMIN', 'ORGANIZER')) DEFAULT 'USER',
  "paymentGroupId" INT REFERENCES "paymentGroups"("id") ON DELETE SET NULL DEFAULT NULL,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL
);

CREATE TABLE "events" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "organizerId" INT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "startDate" TIMESTAMP NOT NULL,
  "endDate" TIMESTAMP NOT NULL,
  "address" VARCHAR(255) NOT NULL,
  "description" VARCHAR(511) NOT NULL,
  "paymentGroupId" INT NOT NULL REFERENCES "paymentGroups"("id") ON DELETE CASCADE
);

-- Insert test data
INSERT INTO "users" ("id", "activated", "fullName", "email", "password", "birthday", "role", "paymentGroupId", "createdAt", "updatedAt")
VALUES
(1, TRUE, 'John Doe', 'john.doe@example.com', 'hashedpassword123', '1990-01-01', 'USER', NULL, '2023-01-01 10:00:00', '2023-01-01 10:00:00'),


INSERT INTO "events" ("id", "name", "organizerId", "startDate", "endDate", "address", "description", "paymentGroupId")
VALUES
(1, 'Sample Event', 1, '2023-06-01 10:00:00', '2023-06-02 18:00:00', '123 Main St, Cityville', 'This is a sample event description.', 1),

-- Ensure the sequence for SERIAL is correct
SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM "users"), 1), false);


-- Drop table if it exists
DROP TABLE IF EXISTS "paymentGroups";

CREATE TABLE "paymentGroups" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT DEFAULT NULL,
  "walletLink" VARCHAR(255) NOT NULL
);


-- Drop table if it exists
DROP TABLE IF EXISTS "userPaymentGroupsWallets";

CREATE TABLE "userPaymentGroupsWallets" (
  "id" SERIAL PRIMARY KEY,
  "userId" INT REFERENCES "users"("id") ON DELETE CASCADE,
  "paymentGroupId" INT REFERENCES "paymentGroups"("id") ON DELETE CASCADE,
  "amount" DECIMAL(10,2) DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE ("userId", "paymentGroupId") -- Ensures a user can't register twice for the same event
);
