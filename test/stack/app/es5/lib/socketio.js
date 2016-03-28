/**
 * socketio
 */

"use strict";


/* Node modules */


/* Third-party modules */
var _ = require("lodash");
var io = require("socket.io");
var Promise = require("es6-promise").Promise;


/* Files */
var Base = require("../../../../../lib/base").Base;


exports.SocketIO = Base.extend({


    broadcast: function (request, broadcast) {

        var args = [
            broadcast.event
        ];

        args = _.concat(args, broadcast.data);

        if (broadcast.target) {
            request.socket.nsp.to(broadcast.target)
                .emit.apply(request.socket.nsp, args);
        } else {
            request.socket.nsp.emit.apply(request.socket.nsp, args);
        }

    },


    connect: function (namespace, middleware)  {

        return new Promise(resolve => {

            var nsp = this._inst
                .of(namespace);

            _.each(middleware, function (fn) {
                nsp.use(fn);
            });

            nsp.on("connection", function (socket) {

                /* Send both the socket and the namespace */
                resolve({
                    socket: socket,
                    nsp: nsp
                });

            });

        });

    },


    createSocket: function (server) {
        this._inst = io(server.getRawServer());
    },


    getSocketId: function (obj) {
        return obj.socket.id;
    },


    joinChannel: function (obj, channel) {
        obj.socket.join(channel);
    },


    leaveChannel: function (obj, channel) {
        obj.socket.leave(channel);
    },


    listen: function (obj, event, fn) {
        obj.socket.on(event, fn);
    }


});