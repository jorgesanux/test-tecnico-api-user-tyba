import express from "express";
import AuthController from "../controller/auth.controller.js";

const authController = new AuthController();

const router = express.Router();

router.post("/login", (req, res ,next)=>{
    authController.login(req, res, next)
});
router.post("/logout", (req, res ,next)=>{
    authController.logout(req, res, next);
});
router.post("/register", (req, res ,next)=>{
    authController.register(req, res, next);
});

export default router;