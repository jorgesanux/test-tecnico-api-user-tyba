import History from "../model/history.model.js";
import HistoryController from "../controller/history.controller.js";

const historyController = new HistoryController();

async function history(req, res, next){
    try{
        historyController.saveHistory(req, res, next);
        next();
    }catch(error){
        next(error);
    }
}

export {
    history
};