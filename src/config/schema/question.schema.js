import {
    pgTable,
    serial,
    integer,
    text,
    boolean,
    json,
    timestamp,
} from "drizzle-orm/pg-core"

export const questions = pgTable("questions", {
    id: serial("id").primaryKey(),
    pollId: integer("poll_id").notNull(),
    questionText: text("question_text").notNull(),
    options: json("options").notNull(),
    isRequired: boolean("is_required").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull()
})