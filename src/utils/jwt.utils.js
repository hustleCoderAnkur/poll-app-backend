import jwt from "jsonwebtoken"  

export const generateAccessToken = (user) => {

    return jwt.sign(
        {
            id: user.id,
            email: user.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )  
}  

export const generateRefreshToken = (user) => {

    return jwt.sign(
        {
            id: user.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )  
}  

export const verifyAccessToken = (token) => {

    try {
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        )  
        return decoded  

    } catch (error) {
        return null 
    }
}  

export const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET
        )  
        return decoded  

    } catch (error) {
        return null  
    }
}  