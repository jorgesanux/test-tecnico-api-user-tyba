import express from "express";

import CityController from "../controller/city.controller.js";
import authenticator from "../middleware/authenticator.js";

const cityController = new CityController();

const router = express.Router();

router.post("/restaurants", authenticator, (req, res, next)=>{
    cityController.getRestaurantsByCoords(req, res, next);
});

export default router;