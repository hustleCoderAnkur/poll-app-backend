import { verifyAccessToken } from "../utils/jwt.utils.js"  

export const Authenticate = async (req, res, next) => {
   
    try {
        const authHeader = req.headers.authorization  

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access token missing"
            })  
        }

        const accessToken = authHeader.split(" ")[1]  
        const decoded = verifyAccessToken(accessToken)  

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            })  
        }
        req.user = decoded  
        next()  

    } catch (error) {
        console.log(error)  
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })  
    }
}  