import {
    createResponseService,
    getResponsesByPollService,
    getResponsesByQuestionService,
    getPollAnalyticsService
} from "../services/response.service.js";

import { getIO } from "../sockets/socket.js";


export const createResponse = async (req, res) => {

    try {

        const response =
            await createResponseService({
                user: req.user,
                ...req.body
            });


        const io = getIO();

        const analytics =
            await getPollAnalyticsService(
                Number(response.pollId)
            );

        io.to(`poll:${response.pollId}`).emit(
            "analytics-update",
            analytics
        );

        io.to(`poll:${response.pollId}`).emit(
            "live-count",
            analytics.totalResponses
        );


        return res.status(201).json({
            success: true,
            message:
                "Response submitted successfully",
            response
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const getResponsesByPoll =
    async (req, res) => {

        try {

            const responses =
                await getResponsesByPollService(
                    Number(req.params.pollId)
                );

            return res.status(200).json({
                success: true,
                responses
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };


export const getResponsesByQuestion =
    async (req, res) => {

        try {

            const responses =
                await getResponsesByQuestionService(
                    Number(req.params.questionId)
                );

            return res.status(200).json({
                success: true,
                responses
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };


export const getPollAnalytics =
    async (req, res) => {

        try {

            const analytics =
                await getPollAnalyticsService(
                    Number(req.params.pollId)
                );

            return res.status(200).json({
                success: true,
                analytics
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };