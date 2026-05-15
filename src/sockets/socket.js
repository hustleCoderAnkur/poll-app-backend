import { Server } from "socket.io"

let io

export const initSocket = (server) => {

    io = new Server(server, {
        cors: {
            origin: "https://poll-app-frontend-chi.vercel.app",
            methods: ["GET", "POST"],
        },
    })

    io.on("connection", (socket) => {
        console.log(`Socket Connected: ${socket.id}`)

        socket.on("join-poll", (pollId) => {
            socket.join(`poll:${pollId}`)
            console.log(`Socket ${socket.id} joined poll:${pollId}`)
        })

        socket.on("disconnect", () => {
            console.log(`Socket Disconnected: ${socket.id}`)
        })
    })

    return io
}

export const getIO = () => {

    if (!io) {
        throw new Error(
            "Socket.io not initialized"
        )
    }

    return io
}