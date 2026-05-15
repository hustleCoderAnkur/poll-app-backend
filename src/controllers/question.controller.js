import {
    createQuestionService,
    updateQuestionService,
    deleteQuestionService,
    getQuestionsByPollIdService,
    getQuestionByIdService
} from "../services/question.service.js"

export const createQuestion = async (req, res) => {
    
    try {
        const question =
            await createQuestionService({
                creatorId: req.user.id,
                ...req.body
            })

        return res.status(201).json({
            success: true,
            message:
                "Question created successfully",
            question
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const updateQuestion = async ( req, res ) => {

    try {
        const question =
            await updateQuestionService({
                questionId: Number( req.params.questionId ),
                creatorId: req.user.id,
                ...req.body
            })

        return res.status(200).json({
            success: true,
            message: "Question updated successfully",
            question
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const deleteQuestion = async ( req,res ) => {

    try {
        await deleteQuestionService({
            questionId: Number(
                req.params.questionId
            ),
        creatorId: req.user.id
        })

        return res.status(200).json({
            success: true,
            message: "Question deleted successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getQuestionsByPollId =
    async (req, res) => {

        try {
            const questions = await getQuestionsByPollIdService(Number(req.params.pollId))

            return res.status(200).json({
                success: true,
                questions
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

export const getQuestionById = async (req, res) => {
    
    try {
        const question = await getQuestionByIdService(Number(req.params.questionId))

        return res.status(200).json({
            success: true,
            question
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}