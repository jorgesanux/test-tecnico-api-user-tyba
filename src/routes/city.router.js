import express from "express";

import CityController from "../controller/city.controller.js";

const cityController = new CityController();

const router = express.Router();

router.post("/restaurants", (req, res, next)=>{
    cityController.getRestaurantsByCoords(req, res, next);
});

export default router;