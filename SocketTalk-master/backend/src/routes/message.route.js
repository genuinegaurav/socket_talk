import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controller/message.controller.js";

const router = express.Router();

//get method for side bar user fethcing
router.get("/users", protectRoute, getUsersForSidebar);

//chat route bw two user 
router.get("/:id", protectRoute, getMessages);

//send message to user 
router.post("/send/:id", protectRoute, sendMessage);

export default router;