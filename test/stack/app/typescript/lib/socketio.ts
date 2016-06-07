/**
 * socketio
 */

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";
import * as io from "socket.io";
import {Promise} from "es6-promise";


/* Files */
import {Base} from "../../../../../lib/base";
import {IServerStrategy} from "../../../../../interfaces/serverStrategy";
import {ISocketBroadcast} from "../../../../../interfaces/socketBroadcast";
import {ISocketRequest} from "../../../../../interfaces/socketRequest";
import {ISocketStrategy} from "../../../../../interfaces/socketStrategy";


export class SocketIO extends Base implements ISocketStrategy {


    protected _inst: any;


    public broadcast (request: ISocketRequest, broadcast: ISocketBroadcast) : void {

        if (broadcast.target) {
            request.socket.nsp.to(broadcast.target)
                .emit(broadcast.event, ...broadcast.data);
        } else {
            request.socket.nsp.emit(broadcast.event, ...broadcast.data);
        }

    }


    public connect (namespace: string, middleware: Function[]) : this {

        let nsp = this._inst
            .of(namespace);

        _.each(middleware, (fn: Function) => {
            nsp.use(fn);
        });

        nsp.on("connection", (socket: any) => {

            /* Send both the socket and the namespace */
            this.emit(`${namespace}_connected`, {
                socket,
                nsp
            });

        });

        return this;

    }


    public createSocket (server: IServerStrategy) : void {
        this._inst = io(server.getRawServer());
    }


    public disconnect ({socket}: any) : void {
        socket.disconnect();
    }


    public getSocketId ({ socket }: any) : string {
        return socket.id;
    }


    public joinChannel ({ socket }: any, channel: string) : void {
        socket.join(channel);
    }


    public leaveChannel ({ socket }: any, channel: string) : void {
        socket.leave(channel);
    }


    public listen ({ socket }: any, event: string, fn: () => void) {
        socket.on(event, fn);
    }


}
