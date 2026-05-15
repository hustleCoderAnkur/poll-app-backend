import {
    pgTable,
    serial,
    varchar,
    text,
    boolean,
    integer,
    timestamp,
} from "drizzle-orm/pg-core"

export const polls = pgTable("polls", {
    id: serial("id").primaryKey(),
    creatorId: integer("creator_id").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    shareId: varchar("share_id", { length: 255 }).notNull().unique(),
    allowAnonymous: boolean("allow_anonymous").default(true),
    allowAuthenticated: boolean("allow_authenticated").default(true),
    isPublished: boolean("is_published").default(false),
    isActive: boolean("is_active").default(true),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
})