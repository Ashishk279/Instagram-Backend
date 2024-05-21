import express from "express";
import cookieParser from "cookie-parser";
import { router } from "./routers/index.js"
import { sendFailResponse } from "./utils/apiFailResponse.js";


const app = express();

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
    if (req.headers && req.headers.lang) {
        i18n.setLocale(req.headers.lang)
    } else {
        i18n.setLocale('en')
    }
    next();
});

app.use(function (err, req, res, next) {
    console.error(err);
    const status = err.status || 400;
    if (err.message == "jwt expired" || err.message == "Authentication error") { res.status(401).send({ status: 401, message: err }); }
    if (typeof err == typeof "") { sendFailResponse(req, res, status, err); }
    else if (err.Error) res.status(status).send({ status: status, message: err.Error });
    else if (err.message) res.status(status).send({ status: status, message: err.message });
    else res.status(status).send({ status: status, message: err.message });
});

app.use("/api/v1", router)


export { app }