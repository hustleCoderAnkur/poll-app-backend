import bcrypt from "bcrypt"
import { eq } from "drizzle-orm"

import {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken
} from "../utils/jwt.utils.js"

import { db } from "../config/db/db.js"
import { users } from "../config/schema/user.schema.js"

export const registerUserService = async ({username, email, password }) => {

    if (!username || !email || !password) {
        throw new Error("All fields are required")
    }

    const existingUser = await db.select()
        .from(users)
        .where(eq(users.email, email))

    if (existingUser.length > 0) {
        throw new Error("Email already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await db.insert(users)
        .values({
            username,
            email,
            password: hashedPassword
        })
        .returning()

    return {
        id: newUser[0].id,
        username: newUser[0].username,
        email: newUser[0].email
    }
}

export const loginUserService = async ({email,password}) => {

    if (!email || !password) {
        throw new Error("All fields are required")
    }

    const user = await db.select()
        .from(users)
        .where(eq(users.email, email))

    if (user.length === 0) {
        throw new Error("User not found")
    }

    if (!user[0].password) {
        throw new Error(
            "Please login with Google"
        );
    }

    const isPasswordMatched = await bcrypt.compare(password,user[0].password)

    if (!isPasswordMatched) {
        throw new Error("Invalid credentials")
    }

    const accessToken = generateAccessToken(user[0])
    const refreshToken = generateRefreshToken(user[0])

    return {
        accessToken,
        refreshToken,
        user: {
            id: user[0].id,
            username: user[0].username,
            email: user[0].email
        },
    }
}

export const getCurrentUserService = async (accessToken) => {

    if (!accessToken) {
        throw new Error("Access token missing")
    }

    const decoded = verifyAccessToken(accessToken)

    if (!decoded) {
        throw new Error("Invalid access token")
    }

    const user = await db.select()
        .from(users)
        .where(eq(users.id, decoded.id))

    if (user.length === 0) {
        throw new Error("User not found")
    }

    return {
        id: user[0].id,
        username: user[0].username,
        email: user[0].email
    }
}

export const changePasswordService = async ({ userId, currentPassword, newPassword }) => {

    if (!currentPassword || !newPassword) {
        throw new Error("All fields are required")
    }

    const user = await db.select()
        .from(users)
        .where(eq(users.id, userId))

    if (user.length === 0) {
        throw new Error("User not found")
    }

    const isPasswordMatched = await bcrypt.compare(
        currentPassword,
        user[0].password
    )

    if (!isPasswordMatched) {
        throw new Error("Current password is incorrect")
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await db.update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, userId))

    return true
}