import express from "express"
import authRoutes from "./routes/auth.route.js"
import dotenv from "dotenv"
import {connectDB} from "./lib/db.js"
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js"
import cors from "cors"
import { app,server } from "./lib/socket.js";
import path from "path"
dotenv.config();
const __dirname=path.resolve()
const PORT = process.env.PORT || 5001;

// In your index.js (or wherever you create the Express app)
// Increase the body parser limit
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET","POST","PUT","DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    // etc.
  }));
  

app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)

if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")))

  app.get("*",(req,res)=>
  {
    res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
  })
}
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});