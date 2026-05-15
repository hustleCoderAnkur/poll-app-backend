ALTER TABLE "responses" DROP CONSTRAINT "responses_submission_token_question_id_unique";--> statement-breakpoint
ALTER TABLE "responses" DROP COLUMN "submission_token";--> statement-breakpoint
ALTER TABLE "responses" ADD CONSTRAINT "responses_user_id_question_id_unique" UNIQUE("user_id","question_id");