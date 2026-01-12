CREATE TYPE "public"."NotificationType" AS ENUM('ORDER_CREATED', 'ORDER_CONFIRMED', 'ORDER_UPDATED', 'GENERIC');--> statement-breakpoint
CREATE TYPE "public"."OrderStatus" AS ENUM('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."ReviewStatus" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."Role" AS ENUM('USER', 'STAFF', 'ADMIN', 'SUPER_ADMIN');--> statement-breakpoint
CREATE TABLE "Dish" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"imageUrl" text NOT NULL,
	"price" double precision NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userId" text
);
--> statement-breakpoint
CREATE TABLE "JobApplication" (
	"id" text PRIMARY KEY NOT NULL,
	"lastName" text NOT NULL,
	"firstName" text NOT NULL,
	"email" text NOT NULL,
	"telephone" text,
	"cvUrl" text NOT NULL,
	"position" text DEFAULT 'Chef Cuisinier' NOT NULL,
	"message" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Notification" (
	"id" text PRIMARY KEY NOT NULL,
	"type" "NotificationType" NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"userId" text NOT NULL,
	"orderId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "OrderItem" (
	"id" text PRIMARY KEY NOT NULL,
	"orderId" text NOT NULL,
	"dishId" text NOT NULL,
	"quantity" integer NOT NULL,
	"price" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Order" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"secretCode" text NOT NULL,
	"total" double precision NOT NULL,
	"seats" integer DEFAULT 1 NOT NULL,
	"status" "OrderStatus" DEFAULT 'PENDING' NOT NULL,
	"paymentMethod" text,
	"deliveryName" text,
	"deliveryPhone" text,
	"deliveryLocation" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Order_secretCode_unique" UNIQUE("secretCode")
);
--> statement-breakpoint
CREATE TABLE "ReviewReply" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"reviewId" text NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Review" (
	"id" text PRIMARY KEY NOT NULL,
	"rating" smallint NOT NULL,
	"comment" text NOT NULL,
	"status" "ReviewStatus" DEFAULT 'PENDING' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"dislikes" integer DEFAULT 0 NOT NULL,
	"userId" text NOT NULL,
	"dishId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"telephone" text NOT NULL,
	"role" "Role" DEFAULT 'USER' NOT NULL,
	"emailConfirmed" boolean DEFAULT false NOT NULL,
	"confirmationToken" text,
	"confirmationTokenExpires" timestamp,
	"resetToken" text,
	"resetTokenExpires" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "User_email_unique" UNIQUE("email"),
	CONSTRAINT "User_telephone_unique" UNIQUE("telephone")
);
