-- PostgreSQL dump converted from MySQL

-- Drop table if it exists
DROP TABLE IF EXISTS "users";

-- Create table
CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "activated" BOOLEAN DEFAULT FALSE,
  "fullName" VARCHAR(255) DEFAULT NULL,
  "email" VARCHAR(255) DEFAULT NULL,
  "password" VARCHAR(255) DEFAULT NULL,
  "birthday" VARCHAR(255) DEFAULT NULL,
  "role" VARCHAR(10) CHECK ("role" IN ('USER', 'ADMIN')) DEFAULT 'USER',t
  "cguActivated" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL
);

-- Insert data
INSERT INTO "users" ("id", "activated", "fullName", "email", "password", "birthday", "role", "cguActivated", "createdAt", "updatedAt") 
VALUES 
(1, FALSE, 'John Doe', 'johndoe@example.com', '$2a$10$/FP1KvbK6LK15vdmPsAp5Omz6GSkaCTMhRhVUGvAwE67M7vCIfFI.', NULL, 'USER', FALSE, '2025-02-27 10:02:23', '2025-02-27 10:02:23');

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