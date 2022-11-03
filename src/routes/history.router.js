import express from "express";
import HistoryController from "../controller/history.controller.js";

const historyController = new HistoryController();
const router = express.Router();

router.get("/history", historyController.getHistory.bind(historyController));

export default router;