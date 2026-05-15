import { and, eq } from "drizzle-orm";

import { db } from "../config/db/db.js";

import { responses } from "../config/schema/response.schema.js";
import { polls } from "../config/schema/poll.schema.js";
import { questions } from "../config/schema/question.schema.js";


// ── Create Response ──────────────────────────────────
export const createResponseService = async ({
    pollId,
    questionId,
    selectedOption,
    isAnonymous,
    user,
    submissionToken
}) => {

    if (
        !pollId ||
        !questionId ||
        !selectedOption
    ) {

        throw new Error(
            "Required fields are missing"
        );
    }


    // ── Validate submission token ────────────────────
    if (!submissionToken) {

        throw new Error(
            "Submission token is required"
        );
    }


    // ── Handle anonymous safely ──────────────────────
    const userId =
        isAnonymous
            ? null
            : user?.id ?? null;


    // ── Validate poll ────────────────────────────────
    const poll = await db.select()
        .from(polls)
        .where(
            eq(
                polls.id,
                pollId
            )
        );

    if (poll.length === 0) {

        throw new Error(
            "Poll not found"
        );
    }

    if (
        poll[0].expiresAt &&
        new Date() >
        new Date(poll[0].expiresAt)
    ) {

        throw new Error(
            "Poll has expired"
        );
    }


    // ── Validate question ────────────────────────────
    const question = await db.select()
        .from(questions)
        .where(
            and(
                eq(
                    questions.id,
                    questionId
                ),

                eq(
                    questions.pollId,
                    pollId
                )
            )
        );

    if (question.length === 0) {

        throw new Error(
            "Question not found"
        );
    }

    if (
        !question[0].options.includes(
            selectedOption
        )
    ) {

        throw new Error(
            "Invalid option selected"
        );
    }


    // ── Poll permission validation ───────────────────
    if (
        isAnonymous &&
        !poll[0].allowAnonymous
    ) {

        throw new Error(
            "Anonymous responses are disabled"
        );
    }

    if (
        !isAnonymous &&
        !poll[0].allowAuthenticated
    ) {

        throw new Error(
            "Authenticated responses are disabled"
        );
    }


    // ── Prevent duplicate responses ──────────────────
    const existingResponse =
        await db.select()
            .from(responses)
            .where(
                and(

                    eq(
                        responses.pollId,
                        pollId
                    ),

                    eq(
                        responses.questionId,
                        questionId
                    ),

                    eq(
                        responses.userId,
                        userId
                    )
                )
            );

    if (existingResponse.length > 0) {

        throw new Error(
            "Response already submitted"
        );
    }


    // ── Insert response ──────────────────────────────
    const response = await db
        .insert(responses)
        .values({

            pollId,

            questionId,

            userId,

            submissionToken,

            displayName:
                isAnonymous
                    ? "Anonymous User"
                    : "Authenticated User",

            isAnonymous,

            selectedOption
        })
        .returning();

    return response[0];
};


// ── Responses By Poll ────────────────────────────────
export const getResponsesByPollService =
    async (pollId) => {

        if (!pollId) {

            throw new Error(
                "Poll ID is required"
            );
        }

        const allResponses =
            await db.select()
                .from(responses)
                .where(
                    eq(
                        responses.pollId,
                        pollId
                    )
                );

        return allResponses;
    };


// ── Responses By Question ────────────────────────────
export const getResponsesByQuestionService =
    async (questionId) => {

        if (!questionId) {

            throw new Error(
                "Question ID is required"
            );
        }

        const allResponses =
            await db.select()
                .from(responses)
                .where(
                    eq(
                        responses.questionId,
                        questionId
                    )
                );

        return allResponses;
    };


// ── Poll Analytics ───────────────────────────────────
export const getPollAnalyticsService =
    async (pollId) => {

        if (!pollId) {

            throw new Error(
                "Poll ID is required"
            );
        }

        const pollResponses =
            await db.select()
                .from(responses)
                .where(
                    eq(
                        responses.pollId,
                        pollId
                    )
                );


        // ── Count unique participants ─────────────────
        const uniqueParticipants =
            new Set(
                pollResponses.map(
                    (response) =>
                        response.submissionToken
                )
            );

        const totalResponses =
            uniqueParticipants.size;


        // ── Participation types ───────────────────────
        const anonymousResponses =
            new Set(
                pollResponses
                    .filter(
                        (response) =>
                            response.isAnonymous
                    )
                    .map(
                        (response) =>
                            response.submissionToken
                    )
            ).size;

        const authenticatedResponses =
            new Set(
                pollResponses
                    .filter(
                        (response) =>
                            !response.isAnonymous
                    )
                    .map(
                        (response) =>
                            response.submissionToken
                    )
            ).size;


        // ── Question-wise analytics ───────────────────
        const questionWiseAnalytics = {};

        pollResponses.forEach(
            (response) => {

                if (
                    !questionWiseAnalytics[
                    response.questionId
                    ]
                ) {

                    questionWiseAnalytics[
                        response.questionId
                    ] = {};
                }

                if (
                    !questionWiseAnalytics[
                    response.questionId
                    ][response.selectedOption]
                ) {

                    questionWiseAnalytics[
                        response.questionId
                    ][response.selectedOption] = 0;
                }

                questionWiseAnalytics[
                    response.questionId
                ][response.selectedOption]++;
            }
        );

        return {
            totalResponses,
            anonymousResponses,
            authenticatedResponses,
            questionWiseAnalytics
        };
    };