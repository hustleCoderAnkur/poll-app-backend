import {
    pgTable,
    serial,
    integer,
    varchar,
    boolean,
    text,
    timestamp,
    unique,
} from "drizzle-orm/pg-core"

export const responses = pgTable("responses",{
        id: serial("id").primaryKey(),
        pollId: integer("poll_id").notNull(),
        questionId: integer("question_id").notNull(),
        userId: integer("user_id"),
        displayName: varchar("display_name",{ length: 100 }).notNull(),
        isAnonymous: boolean("is_anonymous").default(false),
        selectedOption: text("selected_option").notNull(),
        submittedAt: timestamp("submitted_at").defaultNow().notNull()
    },

    (table) => ({
        oneResponsePerQuestion:
            unique().on(
                table.userId,
                table.questionId
            ),
    })
)