import History from "../model/history.model.js";

async function history(req, res, next){
    try{
        await History.create({
            endpoint: req.originalUrl,
            hostname: req.hostname,
            ip: req.ip,
            method: req.method,
            email: req.user.email
        });
        next();
    }catch(error){
        next(error);
    }
}

export {
    history
};