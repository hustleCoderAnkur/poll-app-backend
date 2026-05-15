import jwt from "jsonwebtoken"

import {
    getGoogleAuthURLService,
    googleCallbackService
} from "../services/oidc.service.js"

export const googleLogin = async (req, res) => {

    try {

        const authorizationUrl =
            await getGoogleAuthURLService()

        return res.redirect(authorizationUrl)

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const googleCallback = async (req, res) => {

    try {

        const user =
            await googleCallbackService(req)

        const accessToken = jwt.sign(
            {
                id: user._id,
                email: user.email
            },

            process.env.ACCESS_TOKEN_SECRET,

            {
                expiresIn:
                    process.env.ACCESS_TOKEN_EXPIRY
            }
        )

        const refreshToken = jwt.sign(
            {
                id: user._id
            },

            process.env.REFRESH_TOKEN_SECRET,

            {
                expiresIn:
                    process.env.REFRESH_TOKEN_EXPIRY
            }
        )

        res.cookie(
            "accessToken",
            accessToken,
            {
                httpOnly: true,
                secure: false,
                sameSite: "lax"
            }
        )

        res.cookie(
            "refreshToken",
            refreshToken,
            {
                httpOnly: true,
                secure: false,
                sameSite: "lax"
            }
        )

        return res.redirect(
            "https://poll-app-frontend-chi.vercel.app"
        )

    } catch (error) {

        console.log(
            "[GOOGLE OIDC ERROR]",
            error
        )

        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}