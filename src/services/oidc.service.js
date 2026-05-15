import * as client from "openid-client"
import { pool } from "../config/db/db.js"

const APP_BASE_URL = process.env.APP_BASE_URL 

let oidcClient = null

const oidcStates = new Map()

export const initOIDCService = async () => {

    if (
        !process.env.GOOGLE_CLIENT_ID ||
        !process.env.GOOGLE_CLIENT_SECRET
    ) {
        console.warn(
            "[OIDC] Google credentials missing"
        )

        return
    }

    oidcClient =
        await client.discovery(
            new URL(
                "https://accounts.google.com"
            ),

            process.env.GOOGLE_CLIENT_ID,

            process.env.GOOGLE_CLIENT_SECRET
        )

    console.log(
        "[OIDC] Google client initialized"
    )
}

export const getGoogleAuthURLService = async () => {

    if (!oidcClient) {
        throw new Error(
            "OIDC client not initialized"
        )
    }

    const state =
        client.randomState()

    const codeVerifier =
        client.randomPKCECodeVerifier()

    const codeChallenge =
        await client.calculatePKCECodeChallenge(
            codeVerifier
        )

    oidcStates.set(
        state,
        codeVerifier
    )

    const authorizationUrl =
        client.buildAuthorizationUrl(
            oidcClient,
            {
                redirect_uri:
                    process.env.GOOGLE_CALLBACK_URL,

                scope:
                    "openid email profile",

                state,

                code_challenge:
                    codeChallenge,

                code_challenge_method:
                    "S256",

                prompt:
                    "select_account"
            }
        )

    return authorizationUrl.toString()
}

export const googleCallbackService = async (req) => {

    if (!oidcClient) {
        throw new Error(
            "OIDC client not initialized"
        )
    }

    const { state } = req.query

    const codeVerifier =
        oidcStates.get(state)

    if (!codeVerifier) {
        throw new Error(
            "Invalid or expired state"
        )
    }

    oidcStates.delete(state)

    const currentUrl =
        new URL(
            req.originalUrl,
            APP_BASE_URL
        );

    const tokens =
        await client.authorizationCodeGrant(
            oidcClient,

            currentUrl,

            {
                pkceCodeVerifier:
                    codeVerifier,

                expectedState:
                    state,

                redirect_uri:
                    process.env.GOOGLE_CALLBACK_URL
            }
        )

    const userInfo =
        await client.fetchUserInfo(
            oidcClient,
            tokens.access_token
        )

    const {
        sub,
        email,
        name,
        picture
    } = userInfo

    const username =
        name
            ?.replace(/\s+/g, "_")
            .toLowerCase()
            .slice(0, 50)

    const existingUser =
        await pool.query(
            `
            SELECT *
            FROM users
            WHERE email = $1
            `,
            [email]
        )

    let user

    if (
        existingUser.rows.length > 0
    ) {

        user =
            existingUser.rows[0]

    } else {

        const createdUser =
            await pool.query(
                `
                INSERT INTO users
                (
                    username,
                    email,
                    avatar,
                    oidc_provider,
                    oidc_sub
                )

                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5
                )

                RETURNING *
                `,
                [
                    username,
                    email,
                    picture,
                    "google",
                    sub
                ]
            )

        user =
            createdUser.rows[0]
    }

    return user
}