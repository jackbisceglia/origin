DROP TABLE IF EXISTS "user",
"user",
"cafe",
"drink",
"beans",
"zero.schemaVersions" CASCADE;

DROP TYPE "cafe_vibe", "drink_type", "roast_type" CASCADE;

CREATE TYPE cafe_vibe AS ENUM ('modern', 'cozy', 'artisanal', 'social', 'studious');
CREATE TYPE drink_type AS ENUM ('coffee', 'tea', 'other');
CREATE TYPE roast_type AS ENUM ('light', 'medium', 'dark');

CREATE TABLE "user" (
  "id" VARCHAR PRIMARY KEY,
  "name" VARCHAR NOT NULL
);

CREATE TABLE "cafe" (
  "id" VARCHAR PRIMARY KEY,
  "userId" VARCHAR REFERENCES "user"(id) NOT NULL,
  "name" VARCHAR(128) NOT NULL,
  "city" VARCHAR(128) NOT NULL,
  "vibe" cafe_vibe NOT NULL,
  "rating" INTEGER DEFAULT 0 NOT NULL,
  "lastVisited" double precision DEFAULT (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000)
);

CREATE TABLE "drink" (
  "id" VARCHAR PRIMARY KEY,
  "cafeId" VARCHAR REFERENCES "cafe"(id) NOT NULL,
  "name" VARCHAR(128) NOT NULL,
  "notes" VARCHAR(4096) NOT NULL,
  "type" drink_type NOT NULL,
  "rating" INTEGER DEFAULT 0 NOT NULL,
  "date" double precision DEFAULT (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000)
);

CREATE TABLE "beans" (
  "id" VARCHAR PRIMARY KEY,
  "cafeId" VARCHAR REFERENCES "cafe"(id) NOT NULL,
  "name" VARCHAR(128) NOT NULL,
  "notes" VARCHAR(4096) NOT NULL,
  "origin" VARCHAR(4096) NOT NULL,
  "roast" roast_type NOT NULL,
  "rating" INTEGER DEFAULT 0 NOT NULL,
  "date" double precision DEFAULT (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000)
);

INSERT INTO "user" (id, name) VALUES ('0193dda2-a111-7ea3-8ca3-7f132c039815', 'jack');