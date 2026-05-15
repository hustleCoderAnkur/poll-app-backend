import { Router } from "express"

import {
    googleLogin,
    googleCallback
} from "../controllers/oidc.controller.js"


const router = Router()

router.get("/google", googleLogin )

router.get( "/google/callback", googleCallback)

export default router