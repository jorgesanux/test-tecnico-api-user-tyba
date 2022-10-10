import History from "../model/history.model.js";

async function history(req, res, next){
    try{
        History.create({
            endpoint: req.originalUrl,
            hostname: req.hostname,
            ip: req.ip,
            method: req.method
        });
        next();
    }catch(error){
        next(error);
    }
}

export {
    history
};