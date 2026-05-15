import {
    registerUserService,
    loginUserService,
    getCurrentUserService,
    changePasswordService
} from "../services/auth.service.js"

export const registerUser = async (req, res) => {

    try {
        const user = await registerUserService(req.body)
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const loginUser = async (req, res) => {

    try {
        const data = await loginUserService(req.body)
        return res.status(200).json({
            success: true,
            message: "Login successful",
            ...data
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const logoutUser = async (req, res) => {

    try {
        return res.status(200).json({
            success: true,
            message: "Logout successful"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getCurrentUser = async (req, res) => {

    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access token missing"
            })
        }

        const accessToken = authHeader.split(" ")[1]

        const user = await getCurrentUserService(accessToken)

        return res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const changePassword = async (req, res) => {

    try {
        await changePasswordService({
            userId: req.user.id,
            ...req.body
        })

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}