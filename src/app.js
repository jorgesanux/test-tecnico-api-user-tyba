import 'dotenv/config';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { fileURLToPath } from 'url';

import APIError from "./util/apiError.js";
import { history } from './middleware/history.middleware.js';
import authenticator from "./middleware/authenticator.middleware.js";

import indexRouter from "./routes/index.js";
import authRouter from "./routes/auth.router.js"
import cityRouter from "./routes/city.router.js"
import historyRouter from "./routes/history.router.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(history);

app.use('/', indexRouter);
app.use("/auth", authRouter);
app.use("/city", authenticator, history, cityRouter);
app.use("/transaction", authenticator, history, historyRouter);

app.use((error, _req, res, next) => {
    if (error instanceof APIError) {
        res.status(error.status);
        res.json(error.toJSON());
    } else {
        next(error);
    }
});
app.use(function (error, _req, res, _next) {
    res.status(500);
    res.json(new APIError(500, error.message, error?.original?.code).toJSON());
});

export default app;