import crypto from "crypto"

export const generateRandomToken = (size = 32) => {
    return crypto.randomBytes(size).toString("hex")
}

export const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex")
}

export const compareToken = ( plainToken,hashedToken ) => {
    const hashedPlainToken = crypto.createHash("sha256").update(plainToken).digest("hex")
    return hashedPlainToken === hashedToken
}

