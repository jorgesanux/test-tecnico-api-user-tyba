import jwt from "jsonwebtoken";

import User from "../model/user.model.js";
import APIError from "../util/apiError.js";
import APIResponse from "../util/apiResponse.js";
import redisClient from "../db/redis.js";

export default class AuthController {

    async login(req, res, next) {
        try {
            let { user: email, password } = req.body;
            const userObj = await this.validateCredentials(email, password);

            const data = userObj.toJSON();
            delete data.password;

            const nameKeyTokenRedis = `${data.email}:token`;
            let tokenRedis = await redisClient.get(nameKeyTokenRedis);

            let token = null;
            if(tokenRedis){
                token = tokenRedis;
            } else {
                let timestampToExpire = Math.floor((Date.now() + Number(process.env.TIME_LIVE_TOKEN)) / 1000);
                
                token = jwt.sign({
                    data,
                    exp: timestampToExpire
                }, process.env.JWT_SECRET);

                await redisClient.set(nameKeyTokenRedis, token, {
                    EXAT: timestampToExpire
                });
            }

            data.token = token;

            res.status(200);
            res.json(new APIResponse({
                statusCode: 200,
                message: "Authentication successfully",
                result: data
            }).toJSON());
        } catch (error) {
            next(error);
        }
    }

    async logout(){}

    async register(req, res, next) {
        const payload = req.body;
        try{
            const lastUser = await User.findOne({
                where: {
                    email: payload.email
                }
            })

            if(lastUser !== null) throw new APIError(409, `User already exists`);

            const user = await User.create(payload);
            const data = user.toJSON();
            delete data.password;
            res.status(201);
            res.json(new APIResponse({
                statusCode: 201,
                message: "User created",
                result: data
            }).toJSON());
        }catch(error){
            next(error);
        }
    }

    async validateCredentials(email, password) {
        if (!email || !password) throw new APIError(401, `Invalid credentials`);
        const user = await User.findOne({
            where: {
                email
            }
        });
        const isValid = await user?.validPassword(password);

        if (user === null || !isValid) throw new APIError(401, `Invalid credentials`);

        return user;
    }

    authenticate(req, res, next){
        let token = req.body.token ||
            req.query.token ||
            req.get("Authorization");

        try{
            if(!token) throw new APIError(404, `Token not found`);
            if(token.includes("Bearer")){
                token = token.substring(7);
            }
            req.user = jwt.verify(token, process.env.JWT_SECRET)?.data;
            next();
        }catch(error){
            if(error instanceof jwt.JsonWebTokenError){
                throw new APIError(401, error.message);
            }else{
                throw error;
            }
        }
    }
}