-- PostgreSQL dump converted from MySQL

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
  "role" VARCHAR(10) CHECK ("role" IN ('USER', 'ADMIN')) DEFAULT 'USER',t
  "cguActivated" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL
);

CREATE TABLE "events" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255),
  "organizer" VARCHAR(255),
  "startDate" TIMESTAMP,
  "endDate" TIMESTAMP,
  "adress" VARCHAR(255)
);

-- Insert test data
INSERT INTO "users" ("id", "activated", "fullName", "email", "password", "birthday", "role", "cguActivated", "createdAt", "updatedAt") 
VALUES 
(1, FALSE, 'John Doe', 'johndoe@example.com', '$2a$10$/FP1KvbK6LK15vdmPsAp5Omz6GSkaCTMhRhVUGvAwE67M7vCIfFI.', NULL, 'USER', FALSE, '2025-02-27 10:02:23', '2025-02-27 10:02:23');

INSERT INTO "events" ("id", "name", "organizer", "startDate", "endDate", "adress") 
VALUES 
(1, "test", 'huiezhfiufez', '2025-06-15 12:30:00', '2025-06-15 12:40:00', 'somewhere');

-- Ensure the sequence for SERIAL is correct
SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM "users"), 1), false);
