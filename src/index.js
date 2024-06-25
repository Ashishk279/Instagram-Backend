import connectDB from "./database/db.js";
import dotenv from 'dotenv';
import { server } from "./app.js";
import setUpSocket from "../src/services/socket.js"

dotenv.config({
    path: './.env'
})

connectDB().then(() => {
    server.listen((process.env.PORT || 8000), () => {
        setUpSocket(server)
        console.log(`Server is running at port: ${process.env.PORT} `)
    })
}).catch((err) => [
    console.log("MongoDB connection failed!!!", err)
])