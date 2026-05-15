import crypto from "crypto"
import { eq } from "drizzle-orm"
import { db } from "../config/db/db.js"
import { polls } from "../config/schema/poll.schema.js"

export const createPollService = async ({
    creatorId,
    title,
    description,
    expiresAt,
    allowAnonymous,
    allowAuthenticated
}) => {

    if (!creatorId || !title || !expiresAt) {
        throw new Error("Required fields are missing")
    }

    const shareId = crypto.randomBytes(16).toString("hex")

    const newPoll = await db.insert(polls)
        .values({
            creatorId,
            title,
            description,
            expiresAt: new Date(expiresAt),
            allowAnonymous,
            allowAuthenticated,
            isPublished: false,
            shareId
        })
        .returning()

    return newPoll[0]
}

export const updatePollService = async ({
    pollId,
    creatorId,
    title,
    description,
    expiresAt,
    allowAnonymous,
    allowAuthenticated
}) => {

    if (!pollId || !creatorId) {
        throw new Error("Poll ID and Creator ID are required")
    }

    const existingPoll = await db.select()
        .from(polls)
        .where(eq(polls.id, pollId))

    if (existingPoll.length === 0) {
        throw new Error("Poll not found")
    }

    if (existingPoll[0].creatorId !== creatorId) {
        throw new Error("Unauthorized")
    }

    const updatedPoll = await db.update(polls)
        .set({
            title,
            description,
            expiresAt: expiresAt ? new Date(expiresAt) : existingPoll[0].expiresAt,
            allowAnonymous,
            allowAuthenticated,
            updatedAt: new Date()
        })
        .where(eq(polls.id, pollId))
        .returning()

    return updatedPoll[0]
}

export const deletePollService = async ({ pollId, creatorId }) => {

    if (!pollId || !creatorId) {
        throw new Error("Poll ID and Creator ID are required")
    }

    const existingPoll = await db.select()
        .from(polls)
        .where(eq(polls.id, pollId))

    if (existingPoll.length === 0) {
        throw new Error("Poll not found")
    }

    if (existingPoll[0].creatorId !== creatorId) {
        throw new Error("Unauthorized")
    }

    await db.delete(polls)
        .where(eq(polls.id, pollId))

    return true
}

export const getPollByIdService = async ( pollId ) => {

    if (!pollId) {
        throw new Error("Poll ID is required")
    }

    const poll = await db.select()
        .from(polls)
        .where(eq(polls.id, pollId))

    if (poll.length === 0) {
        throw new Error("Poll not found")
    }

    return poll[0]
}

export const getPollByShareIdService = async ( shareId ) => {

    if (!shareId) {
        throw new Error("Share ID is required")
    }

    const poll = await db.select()
        .from(polls)
        .where(eq(polls.shareId, shareId))

    if (poll.length === 0) {
        throw new Error("Poll not found")
    }

    if ( poll[0].expiresAt && new Date() > new Date(poll[0].expiresAt)) {
        throw new Error("Poll has expired")
    }
    return poll[0]
}

export const publishPollService = async ({ pollId, creatorId }) => {

    if (!pollId || !creatorId) {
        throw new Error("Poll ID and Creator ID are required")
    }

    const existingPoll = await db.select()
        .from(polls)
        .where(eq(polls.id, pollId))

    if (existingPoll.length === 0) {
        throw new Error("Poll not found")
    }

    if (existingPoll[0].creatorId !== creatorId) {
        throw new Error("Unauthorized")
    }

    const publishedPoll = await db.update(polls)
        .set({
            isPublished: true,
            updatedAt: new Date(),
        })
        .where(eq(polls.id, pollId))
        .returning()

    return publishedPoll[0]
}

export const getMyPollsService = async (userId) => {

    const userPolls = await db
        .select()
        .from(polls)
        .where(eq(polls.creatorId, userId));

    return userPolls;
};

export const getPollAnalyticsService = async ( pollId ) => {

    if (!pollId) {
        throw new Error("Poll ID is required")
    }

    const poll = await db.select()
        .from(polls)
        .where(eq(polls.id, pollId))

    if (poll.length === 0) {
        throw new Error("Poll not found")
    }

    return { poll: poll[0] }
}