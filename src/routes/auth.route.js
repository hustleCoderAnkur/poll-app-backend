import { Router } from "express"

import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    changePassword
} from "../controllers/auth.controller.js"
import { Authenticate } from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/register", registerUser)  
router.post("/login", loginUser)  
router.post("/logout", logoutUser)  
router.get("/me", Authenticate, getCurrentUser) 
router.post("/change-password", Authenticate,changePassword) 

export default router  