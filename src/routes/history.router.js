import express from "express";
import HistoryController from "../controller/history.controller.js";

const historyController = new HistoryController();

const router = express.Router();

router.get("/history", (req, res, next) => {
    historyController.getHistory(req, res, next);
});

export default router;