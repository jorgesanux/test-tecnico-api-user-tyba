import APIError from "../util/apiError.js";
import APIResponse from "../util/apiResponse.js";
import History from "../model/history.model.js";

export default class HistoryController{

    async getHistory(req, res, next){
        try{
            const history = await History.findAll();

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

}