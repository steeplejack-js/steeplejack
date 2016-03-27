/**
 * Socket
 *
 * The context of a strategy pattern for socket
 * connections.
 */

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";
import {Promise} from "es6-promise";


/* Files */
import {Base} from "./base";
import {SocketRequest} from "./socketRequest";
import {IAddSocket} from "../interfaces/addSocket";
import {ISocketBroadcast} from "../interfaces/socketBroadcast";
import {ISocketStrategy} from "../interfaces/socketStrategy";


export const CONNECT_FLAG = "connect";

export const MIDDLEWARE_FLAG = "__middleware";


export class Socket extends Base {


    /**
     * Constructor
     *
     * Assigns the strategy object
     *
     * @param {ISocketStrategy} _strategy
     */
    public constructor (protected _strategy: ISocketStrategy) {

        super();

        if (_.isObject(this._strategy) === false) {
            throw new SyntaxError("Socket strategy object is required");
        }

    }


    public listen (request: SocketRequest, event: string, socketFn: Function) {

        this._strategy.listen(request.socket, event, (...params: any[]) => {

            /* Set the parameters received */
            request.params = params;

            return new Promise((resolve) => {

                /* Invoke the function */
                let result = socketFn(request);

                /* Resolve the result */
                resolve(result);

            });

        });

    }


    public namespace (namespace: string, events: IAddSocket) : Socket {

        /* Get connection listener */
        let onConnect = events[CONNECT_FLAG];

        /* Search for any middleware functions */
        let middleware: Function[] = [];
        if (_.has(events, MIDDLEWARE_FLAG)) {
            middleware = <Function[]> events[MIDDLEWARE_FLAG];
        }

        /* Omit the connect and middleware functions now */
        events = (<IAddSocket> _.omit(events, [
            CONNECT_FLAG,
            MIDDLEWARE_FLAG
        ]));

        this._strategy.connect(namespace, middleware)
            .then(connection => {

                let request = new SocketRequest(connection, this._strategy);

                /* Listen for a broadcast event */
                request.on("broadcast", (broadcast: ISocketBroadcast) => {
                    this._strategy.broadcast(request, broadcast);
                });

                /* Fire the connection event */
                if (_.isFunction(onConnect)) {
                    onConnect(request);
                }

                _.each(events, (fn: Function, event: string) => {

                    /* Listen for the event */
                    this.listen(request, event, fn);

                });

            });

        return this;

    }


}