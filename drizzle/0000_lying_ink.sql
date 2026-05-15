CREATE TABLE "polls" (
	"id" serial PRIMARY KEY NOT NULL,
	"creator_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"share_id" varchar(255) NOT NULL,
	"allow_anonymous" boolean DEFAULT true,
	"allow_authenticated" boolean DEFAULT true,
	"is_published" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "polls_share_id_unique" UNIQUE("share_id")
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"poll_id" integer NOT NULL,
	"question_text" text NOT NULL,
	"options" json NOT NULL,
	"is_required" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "responses" (
	"id" serial PRIMARY KEY NOT NULL,
	"poll_id" integer NOT NULL,
	"question_id" integer NOT NULL,
	"user_id" integer,
	"submission_token" varchar(100) NOT NULL,
	"display_name" varchar(100) NOT NULL,
	"is_anonymous" boolean DEFAULT false,
	"selected_option" text NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "responses_submission_token_question_id_unique" UNIQUE("submission_token","question_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
