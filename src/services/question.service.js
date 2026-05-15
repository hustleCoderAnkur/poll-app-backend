import { eq } from "drizzle-orm"
import { db } from "../config/db/db.js"
import {questions } from "../config/schema/question.schema.js"
import { polls } from "../config/schema/poll.schema.js"

export const createQuestionService = async ({
    pollId,
    creatorId,
    questionText,
    options,
    isRequired,
}) => {

    if ( !pollId || !creatorId || !questionText || !options ) {
        throw new Error("Required fields are missing")
    }

    if (!Array.isArray(options)) {
        throw new Error(
            "Options must be an array"
        )
    }

    if (options.length < 2) {
        throw new Error(
            "At least two options are required"
        )
    }

    const poll = await db.select()
        .from(polls)
        .where(eq(polls.id, pollId))

    if (poll.length === 0) {
        throw new Error("Poll not found")
    }

    if (poll[0].creatorId !== creatorId) {
        throw new Error("Unauthorized")
    }

    const newQuestion = await db.insert(questions)
        .values({
            pollId,
            questionText,
            options,
            isRequired,
        })
        .returning()

    return newQuestion[0]
}

export const updateQuestionService = async ({
    questionId,
    creatorId,
    questionText,
    options,
    isRequired,
}) => {

    if (!questionId || !creatorId) {
        throw new Error(
            "Question ID and Creator ID are required"
        )
    }

    const existingQuestion = await db.select()
        .from(questions)
        .where(eq(questions.id, questionId))

    if (existingQuestion.length === 0) {
        throw new Error("Question not found")
    }

    const poll = await db.select()
        .from(polls)
        .where(eq(
                polls.id,
                existingQuestion[0].pollId
            )
        )

    if (poll.length === 0) {
        throw new Error("Poll not found")
    }

    if (poll[0].creatorId !== creatorId) {
        throw new Error("Unauthorized")
    }

    const updatedQuestion = await db.update(questions)
        .set({
            questionText,
            options,
            isRequired,
        })
        .where(eq(questions.id, questionId))
        .returning()

    return updatedQuestion[0]
}

export const deleteQuestionService = async ({ questionId,creatorId }) => {

    if (!questionId || !creatorId) {
        throw new Error("Question ID and Creator ID are required")
    }

    const existingQuestion = await db.select()
        .from(questions)
        .where(eq(questions.id, questionId))

    if (existingQuestion.length === 0) {
        throw new Error("Question not found")
    }

    const poll = await db.select()
        .from(polls)
        .where(eq(
                polls.id,
                existingQuestion[0].pollId
            )
        )

    if (poll.length === 0) {
        throw new Error("Poll not found")
    }

    if (poll[0].creatorId !== creatorId) {
        throw new Error("Unauthorized")
    }

    await db.delete(questions).where(eq(questions.id, questionId))

    return true
}

export const getQuestionsByPollIdService =
    async (pollId) => {

        if (!pollId) {
            throw new Error("Poll ID is required")
        }

        const allQuestions = await db.select()
            .from(questions)
            .where(eq(questions.pollId, pollId))
        return allQuestions
    }

export const getQuestionByIdService = async (questionId) => {

        if (!questionId) {
            throw new Error( "Question ID is required")
        }

        const question = await db.select()
            .from(questions)
            .where(eq(questions.id, questionId))

        if (question.length === 0) {
            throw new Error("Question not found")
        }

        return question[0]
    }