import {
    createPollService,
    updatePollService,
    deletePollService,
    getPollByIdService,
    getPollByShareIdService,
    publishPollService,
    getPollAnalyticsService,
    getMyPollsService
} from "../services/poll.service.js"

export const createPoll = async (req, res) => {

    try {
        const poll = await createPollService({
            creatorId: req.user.id,
            ...req.body
        })

        return res.status(201).json({
            success: true,
            message: "Poll created successfully",
            poll
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const updatePoll = async (req, res) => {

    try {
        const poll = await updatePollService({
            pollId: Number(req.params.pollId),
            creatorId: req.user.id,
            ...req.body
        })

        return res.status(200).json({
            success: true,
            message: "Poll updated successfully",
            poll
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const deletePoll = async (req, res) => {

    try {
        await deletePollService({
            pollId: Number(req.params.pollId),
            creatorId: req.user.id
        })

        return res.status(200).json({
            success: true,
            message: "Poll deleted successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getPollById = async (req, res) => {

    try {
        const poll = await getPollByIdService(
            Number(req.params.pollId)
        )

        return res.status(200).json({
            success: true,
            poll
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getPollByShareId = async (req, res) => {
    
    try {
        const poll = await getPollByShareIdService(
            req.params.shareId
        )

        return res.status(200).json({
            success: true,
            poll
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const publishPoll = async (req, res) => {

    try {
        const poll = await publishPollService({
            pollId: Number(req.params.pollId),
            creatorId: req.user.id
        })

        return res.status(200).json({
            success: true,
            message: "Poll published successfully",
            poll
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getMyPolls = async (req, res) => {

    try {

        const polls = await getMyPollsService(
            req.user.id
        );

        return res.status(200).json({
            success: true,
            polls,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch polls",
        });
    }
};

export const getPollAnalytics = async (req,res) => {

    try {
        const analytics = await getPollAnalyticsService(Number(req.params.pollId))

        return res.status(200).json({
            success: true,
            analytics
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}