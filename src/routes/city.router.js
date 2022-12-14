import express from "express";
import CityController from "../controller/city.controller.js";

const cityController = new CityController();
const router = express.Router();

router.post("/restaurants", cityController.getRestaurantsByCoords.bind(cityController));

export default router;