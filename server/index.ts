import express = require('express');
import path = require('path');

const DIST_DIR = path.join(__dirname, "./client");
const HTML_FILE = path.join(DIST_DIR, "index.html");
const FAVICON = path.join(__dirname, "..", "static", "img", "favicon.ico");
const DEFAULT_PORT = 3000;

const app = express();

app.set("port", process.env.PORT || DEFAULT_PORT);
app.set("json spaces", 2);

app.use(function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // next();

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send("POST");
    }
    else {
        next();
    }
});

/**
 * Production switcher
 */
if (process.env.NODE_ENV === "development") {
    /**
     * DEVELOPMENT
     */
    app.get("/", (req, res) => res.send("Development Mode!"));
    app.get("/favicon.ico", (req, res) => {
        console.log(`serving ${FAVICON}`);
        res.sendFile(FAVICON)
    });
} else {
    /**
     * PRODUCTION
     */
    app.use(express.static(DIST_DIR));
    app.get("/", (req, res) => res.sendFile(HTML_FILE));
    app.get("/favicon.ico", (req, res) => res.sendFile(FAVICON));
}


/**
 * Mount all the routes.
 */
import apiRouter from "./routers";
app.use("/api/v1", apiRouter);

/**
 * This handler needs to be delared after all other app.use (and it would seem app.post et.al.)
 */
app.use(function (err, req, res, next) {
    res.status(500).json({message: err.message});
    next();
});

const server = app.listen(app.get("port"), () => {
    console.log("Brews Server Started");
    server.keepAliveTimeout = 0;
});
