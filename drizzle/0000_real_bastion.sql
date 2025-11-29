CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "events" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "events_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(100) NOT NULL,
	"subcategories" text,
	"tags" text,
	"eventDate" timestamp NOT NULL,
	"latitude" varchar(50) NOT NULL,
	"longitude" varchar(50) NOT NULL,
	"locationName" varchar(255) NOT NULL,
	"borough" varchar(100),
	"videoUrl" text,
	"thumbnailUrl" text,
	"sourceUrl" text,
	"peopleInvolved" text,
	"backgroundInfo" text,
	"details" text,
	"isCrime" boolean DEFAULT false NOT NULL,
	"isVerified" boolean DEFAULT false NOT NULL,
	"createdBy" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
