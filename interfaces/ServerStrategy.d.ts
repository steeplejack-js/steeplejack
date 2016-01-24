/**
 * ServerStrategy
 */


declare interface IServerStrategy {
    acceptParser: (options: any, strict: boolean) => void;
    addRoute: (httpMethod: string, route: string, fn: Function | Function[]) => void;
    after: (fn: Function) => void;
    before: (fn: Function) => void;
    bodyParser: () => void;
    close: () => void;
    enableCORS: (origins: string[], addHeaders: string[]) => void;
    getServer: () => Object;
    gzipResponse: () => void;
    outputHandler: (err: any, data: any, request: Object, result: Object) => any;
    queryParser: (mapParser: boolean) => void;
    start: (port: number, hostname: string, backlog: number) => any;
    uncaughtException: (fn: Function) => void;
    use: (fn: Function | Function[]) => void;
}
