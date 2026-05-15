import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import http from "http"
import cors from "cors"
import { connectDB } from "./src/config/db/db.js"
import authRoutes from "./src/routes/auth.route.js"
import oidcRoutes from "./src/routes/oidc.route.js"
import pollRoutes from "./src/routes/poll.route.js"
import questionRoutes from "./src/routes/question.route.js"
import responseRoutes from "./src/routes/response.route.js"
import { initSocket } from "./src/sockets/socket.js"
import { initOIDCService } from "./src/services/oidc.service.js"

dotenv.config()
const app = express()

const server = http.createServer(app)
initSocket(server)

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/oauth",oidcRoutes)
app.use("/api/v1/polls",pollRoutes)
app.use("/api/v1/questions",questionRoutes)
app.use("/api/v1/responses",responseRoutes)

const port = process.env.PORT || 3000

connectDB()
await initOIDCService()
server.listen(port, () => {
    console.log(`Server is running on ${port}`)
})