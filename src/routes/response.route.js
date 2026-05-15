import { Router } from "express"

import {
    createResponse,
    getResponsesByPoll,
    getResponsesByQuestion,
    getPollAnalytics
} from "../controllers/response.controller.js"

import { Authenticate } from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/", createResponse)
router.get("/poll/:pollId", Authenticate, getResponsesByPoll)
router.get("/question/:questionId", Authenticate, getResponsesByQuestion)
router.get("/poll/:pollId/analytics", Authenticate, getPollAnalytics)

export default router