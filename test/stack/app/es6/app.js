/**
 * app
 */


"use strict";


/* Node modules */
import path from "path";


/* Third-party modules */
import {Steeplejack} from "../../../../steeplejack";
import {Server} from "../../../../lib/server";


/* Files */
import {Restify} from "./lib/restify";
import {SocketIO} from "./lib/socketio";


let app = Steeplejack.app({
    config: require("./config"),
    modules: [
        path.join(__dirname, "!(routes)/**/*.js")
    ],
    routesDir: path.join(__dirname, "routes")
});


app.on("start", () => {
    console.log("ES6 started");
});


app.run($config => {

    const restify = new Restify();

    restify.bodyParser();
    restify.gzipResponse();

    let server = new Server($config.server, restify, new SocketIO());

    /* Listen for errors to log */
    server.on("error", function (err) {

    });

    return server;

});


export {app};
