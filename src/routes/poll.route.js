import {Router} from "express"

import {
    createPoll,
    updatePoll,
    deletePoll,
    getPollById,
    getPollByShareId,
    publishPoll,
    getPollAnalytics,
    getMyPolls,
} from "../controllers/poll.controller.js"

import { Authenticate } from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/", Authenticate, createPoll)
router.get("/myPolls", Authenticate, getMyPolls)
router.get("/share/:shareId", getPollByShareId)
router.get("/:pollId/analytics", Authenticate, getPollAnalytics)
router.patch("/:pollId/publish", Authenticate, publishPoll)
router.get("/:pollId", Authenticate, getPollById)
router.put("/:pollId", Authenticate, updatePoll)
router.delete("/:pollId", Authenticate, deletePoll)

export default router