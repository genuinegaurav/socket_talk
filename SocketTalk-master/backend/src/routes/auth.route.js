import express from "express"
import { checkAuth, login, logout, signup, updateProfile } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router =express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

//protected route  only works when user is login
router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);


export default router