import express from "express";
import AuthController from "../controller/auth.controller.js";
import authenticator from "../middleware/authenticator.middleware.js";

const authController = new AuthController();
const router = express.Router();

router.post("/login", authController.login.bind(authController));
router.post("/logout", authenticator, authController.logout.bind(authController));
router.post("/register", authController.register.bind(authController));

export default router;