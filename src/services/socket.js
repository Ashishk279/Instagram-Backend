import { Server } from "socket.io";
import { jwtVerify } from '../utils/utility.js';
import { Message } from "../models/message.model.js";

const setUpSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*'
        }
    });

    const users = {}; // To store socket.id mapped to user ID
    const usersSockets = {}; // To store user ID mapped to socket instance

    io.use(async (socket, next) => {
        if (socket.handshake.query && socket.handshake.query.token) {

            let decoded = await jwtVerify(socket.handshake.query.token)
            console.log("user ", JSON.stringify(decoded));
            if (!decoded) return next(new Error("Authentication error"))
            else {
                users[String(socket.id)] = decoded._id;
                usersSockets[decoded._id] = socket;
                console.log("Connected socket email", decoded.email)
                socket.join(String(decoded._id))
                next()
            }
        } else {
            next(new Error('Authentication error'));
        }
    }).on("connection", (socket) => {
        console.log("A user connected: ", socket.id);

        socket.on("connectToChat", async (data) => {
            let roomId = "chat_" + data.connectionId;
            socket.join(roomId);
            console.log(socket.rooms); 
            io.to(roomId).emit("connnectToChatOk", { status: 200, message: "Room successfully joined" })

        })

        socket.on("disconnect", () => {
            delete users[String(socket.id)];
            console.log("User disconneted:", socket.id)
        })

        socket.on("sendMessage", async (data) => {
            let user = users[String(socket.id)];
            let roomId = "chat_" + data.connectionId;
            console.log(user, roomId)
            try {
                const message = await Message.create({ sender: data.senderId, recipent: data.recipientId, content: data.content })
                io.to(roomId).emit("receiveMessage", message)
            } catch (error) {
                console.log("Error sending message", error)
            }
        })

        socket.on("messageReceived", async (data) => {
            let user = users[String(socket.id)];
            await Message.findByIdAndUpdate({ _id: data._id }, { isReaded: true })
            io.emit("receivedMessage", { status: 200, message: "Message readed" })
        })

        socket.on("disconnectToChat", (data) => {
            let roomId = "chat_" + data.connectionId;
            console.log(roomId  )
            console.log(socket.rooms); 
            socket.leave(roomId);
            console.log(socket.rooms); 
            console.log("--------------", roomId)
            io.to(roomId).emit("disconnectToChatOk", { status: 200, message: "Room successfully disconnected" })
        })
    });
    return io;
}

export default setUpSocket