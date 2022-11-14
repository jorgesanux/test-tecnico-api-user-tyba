import APIError from "../util/apiError.js";
import APIResponse from "../util/apiResponse.js";
import History from "../model/history.model.js";

export default class HistoryController{

    async getHistory(req, res, next){
        let {page = 1, limit = 10} = req.query;

        try{
            const history = await History.findAll({
                where: {
                    email: req.user.email
                },
                limit,
                offset: (page-1) * limit,
                order: [
                    ["created_at", "DESC"]
                ]
            });

            res.status(200);
            res.json(new APIResponse({
                statusCode: 200,
                message: "Obtained history",
                result: history
            }).toJSON());
        }catch(error){
            next(error)
        }
    }

    async saveHistory(req, res, next){
        await History.create({
            //Se remueve el token, si este llega por query param
            endpoint: req.originalUrl.replace(/token=[^&]*/, "token=***"),
            hostname: req.hostname,
            ip: req.ip,
            agent: req.headers["user-agent"],
            method: req.method,
            email: req?.user?.email ? req.user.email : null
        });
    }
}