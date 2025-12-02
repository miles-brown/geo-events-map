CREATE TYPE "public"."status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "status" "status" DEFAULT 'pending' NOT NULL;