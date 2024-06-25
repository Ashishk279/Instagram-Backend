import express from 'express'
import cookieParser from "cookie-parser";
import http from 'http'
import cors from 'cors'; 
import { router } from "./routers/index.js"
import { sendFailResponse } from "./utils/apiFailResponse.js";
import { i18n } from "../src/utils/i18n.js";
import { ApiError } from "./utils/apiErrors.js";


const app = express();
const server = http.createServer(app);

app.use((req, res, next) => {
    res.append('Access-Control-Expose-Headers', 'x-total, x-total-pages');
    next();
  });
  app.use(cors());
app.use(i18n.init)
app.use(express.json({
    limit: "16kb"
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(express.static("public"));
app.use(cookieParser());

app.use(function (req, res, next) {
    if (req.headers && req.headers.lang && req.headers.lang == 'ar') {
        i18n.setLocale(req.headers.lang)

    } else {
        i18n.setLocale('en')
    }
    next();
});


app.use("/api/v1", router)
app.use(function (err, req, res, next) {
    console.error(err);
    const status = err.status || 400;
    if (err.message == "jwt expired" || err.message == "Authentication error") { res.status(401).send({ status: 401, message: err }); }
    if (typeof err == typeof "") { sendFailResponse(req, res, status, err); }
    else if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            status: err.statusCode,
            message: err.message,
            data: err.data,
            success: err.success,
            errors: err.errors
        });
    }
    else if (err.Error) res.status(status).send({ status: status, message: err.Error });
    else if (err.message) res.status(status).send({ status: status, message: err.message });
    else res.status(status).send({ status: status, message: err.message });
});


export { server }