import { Router } from "express"


import {
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestionsByPollId,
    getQuestionById
} from "../controllers/question.controller.js"

import { Authenticate } from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/", Authenticate,createQuestion )
router.put("/:questionId", Authenticate,updateQuestion )
router.delete("/:questionId", Authenticate,deleteQuestion )
router.get("/poll/:pollId", getQuestionsByPollId)
router.get("/:questionId", getQuestionById)

export default router