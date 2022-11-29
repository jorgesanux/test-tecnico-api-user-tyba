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

            data.token = await this.generateJWT(data);

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

    async logout(req, res ,next) {
        try{
            const keyToken = this.generateKeyJWTRedis(req.user.email);
            await redisClient.del(keyToken);
            res.status(200);
            res.json(new APIResponse({
                statusCode: 200,
                message: "Log out"
            }));
        }catch(error){
            next(error)
        }
    }

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

    async authenticate(req, res, next){
        let token = req.body.token ||
            req.query.token ||
            req.get("Authorization");

        try{
            if(!token) throw new APIError(404, `Token not found`);
            if(token.includes("Bearer")){
                token = token.substring(7);
            }
            req.user = jwt.verify(token, process.env.JWT_SECRET)?.data;
            let tokenRedis = await this.getJWTFromRedis(req.user.email);
            if(!tokenRedis) throw new jwt.JsonWebTokenError("token unlogged");
            
            next();
        }catch(error){
            if(error instanceof jwt.JsonWebTokenError){
                next(new APIError(401, error.message));
            }else{
                next(error);
            }
        }
    }

    generateKeyJWTRedis(email){
        return `${email}:token`;
    }

    async getJWTFromRedis(email) {
        return await redisClient.get(this.generateKeyJWTRedis(email));
    }

    /**
     * 
     * @param {string} email 
     * @param {string} token 
     * @param {number} ttl Time to live in milliseconds (Time for expires)
     */
    async setJWTToRedis(email, token, ttl){
        await redisClient.set(this.generateKeyJWTRedis(email), token, {
            EXAT: ttl
        });
    }

    async generateJWT(user) {
        let token = await this.getJWTFromRedis(user.email);
        if(!token){
            let timestampToExpire = Math.floor((Date.now() + Number(process.env.TIME_LIVE_TOKEN)) / 1000);
            
            token = jwt.sign({
                data: user,
                exp: timestampToExpire
            }, process.env.JWT_SECRET);

            await this.setJWTToRedis(user.email, token, timestampToExpire);
        }
        return token;
    }
}