import jwt from "jsonwebtoken";

import User from "../model/user.model.js";
import APIError from "../util/apiError.js";
import APIResponse from "../util/apiResponse.js";

export default class AuthController {

    async login(req, res, next) {
        try {
            let { user: email, password } = req.body;
            const userObj = await this.validateCredentials(email, password);

            const data = userObj.toJSON();
            delete data.password;

            const token = jwt.sign({
                data,
                exp: Math.floor((Date.now() + 60000) / 1000) //Expires in 60 seconds
            }, process.env.JWT_SECRET);

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

    async register(req, res, next) {
        const payload = req.body;
        try{
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
            if(!token) throw new APIError(401, `Token not found`);
            if(token.includes("Bearer")){
                token = token.substring(7);
            }
            jwt.verify(token, process.env.JWT_SECRET);;
            next();
        }catch(error){
            if(error instanceof jwt.JsonWebTokenError){
                res.status(401);
                res.json({
                    code: 401,
                    message: error.message
                });
            }else{
                throw error;
            }
        }
    }
}