import fetch from "node-fetch"
import { URLSearchParams, URL } from 'url';

import Constant from "../util/constant.js";
import APIError from "../util/apiError.js";
import APIResponse from "../util/apiResponse.js";
import redisClient from "../db/redis.js";

export default class CityController{
    async getRestaurantsByCoords(req, res, next){
        try{
            const {lat, long} = req.body;
            let result = JSON.parse(await redisClient.get(`city:${lat},${long}`));
            if(!result) {
                const response = await this.getNearbyPlacesByLL(lat, long, "restaurantes");
                result = this.transformResults(response);
                await redisClient.set(`city:${lat},${long}`, JSON.stringify(result), {
                    EX: 10 * 60
                });
            }
            res.status(200);
            res.json(new APIResponse({
                statusCode: 200,
                message: "Obtained restaurants",
                result: result
            }).toJSON());
        }catch(error){
            next(error)
        }
    }

    async getNearbyPlacesByLL(latitude, longitude, query){
        try{
            const url = this.generateURL({
                latitude, 
                longitude, 
                query, 
                url: Constant.URL_API_NEARBY_PLACES,
                fields: ["name", "categories", "location", "geocodes"]
            });
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": process.env.API_PLACES_SECRET
                }
            });
            return response.json();
        }catch(error){
            //TODO: validar los errores del api externo
            throw new Error("The api is currently unavailable");
        }
    }

    generateURL({latitude, longitude, query, url, fields}){
        const urlResults = new URL(url);
        const params = new URLSearchParams({
            ll: `${latitude},${longitude}`,
            query,
            fields: fields.join(",")
        });
        urlResults.search = params;
        return urlResults.toString();
    }

    transformResults(jsonRestaurants){
        const results = jsonRestaurants.results;
        return results.map(restaurant => ({
            name: restaurant.name,
            categories: restaurant.categories.map(cat => cat.name).join(", "),
            country: restaurant.location?.country,
            department: restaurant.location?.region,
            city: restaurant.location?.locality,
            location: {
                lat: restaurant.geocodes.main.latitude,
                long: restaurant.geocodes.main.longitude
            }
        }));
    }
}