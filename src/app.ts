import express, {Application, RequestHandler, Response, Request, NextFunction} from "express";
import session, {SessionOptions} from 'express-session';
import route from "./route";
import middleWare from "./middlewares"
import path from "path";
import cookieParser from 'cookie-parser';
var sitemap = require('express-sitemap')();
const sassMiddleware = require('node-sass-middleware');
const ejsLayout = require('express-ejs-layouts');
require('dotenv').config()
import {Server, Socket} from "socket.io";
import http, {createServer} from "http";
import instance from "./instance";
import {extension} from "./app/extensionController";
import * as fs from "fs";

class app {
    private ExpressApp!: Application;
    private server!: http.Server;
    public io!: Server;
    private sessionMiddleware!: RequestHandler;


    constructor(port: number | undefined) {
        this.init(port);
    }

    async init(port: number | undefined){
        this.checks(async (errors: Array<String>, success: boolean) => {
            await errors.forEach((data) => {
                console.error(data);
            }, () => {
                if (!success) return process.exit(1);
            });
        });
        this.ExpressApp = this.expressInit('ejs');
        const extensions = await this.loadExtension();
        for (const extension of extensions){
            await extension.before();
        }
        this.sessionMiddleware = this.expressSession();
        this.expressRegisters();
        this.generateSiteMap(); // generate the site map
        this.server = createServer(this.ExpressApp); // create the http server with express app
        this.io = new Server(this.server, {}); // declare socket.io server
        // register the session middleware for socket io (to get access to session in socket.io)
        let self = this;
        // register the socket IO file (maybe this will change in future to setup socket channel controllers)
        import('./socket').then((socket) => {
            socket.default(this.io)
            console.log('\x1b[36m[Info] > Socket.io listening', '\x1b[0m')
        }).then(async () => {
            this.startServer(this.server, port);
            for (const extension of extensions){
                await extension.after();
            }
        });

        instance.getInstance().data['io'] = this.io;

    }

    expressInit(viewEngine: string | undefined): Application{
        const app: Application = express();
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', (viewEngine) ? viewEngine : "pug");
        app.use(ejsLayout);
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(sassMiddleware({
            src: path.join(__dirname, 'public'),
            dest: path.join(__dirname, 'public'),
            indentedSyntax: process.env.INDENTED_SYNTAX||true, // true = .sass and false = .scss
            sourceMap: true
        }));
        app.use(express.static(path.join(__dirname, 'public')));

        return app;
    }

    async expressRegisters(){
        for (let element of middleWare){
            this.registerMiddleware(element);
        }
        console.log('\x1b[36m[Info] > Tous les middlewares sont enregistré.','\x1b[0m');

        for(let element of route){
            await this.registerRoute(element);
        }
        console.log('\x1b[36m[Info] > Toutes les routes sont enregistré.','\x1b[0m');
        this.registerErrorMiddleWare();
    }

    expressSession(): RequestHandler{
        var sess: SessionOptions = {
            resave: false,
            saveUninitialized: true,
            secret: process.env.SESSION_SECRET || "defaultSecret",
            name: 'waldSession',
            cookie: {}
        }

        if (this.ExpressApp.get('env') === 'production') {
            this.ExpressApp.set('trust proxy', 1) // trust first proxy
            sess.cookie = {
                secure: true
            }
        }
        return session(sess)
    }

    checks(callback: any){
        let errors = [];
        let success = true;
        if(route.length == 0){
            errors.push("Aucune route définie, veuillez définir des routes dans route.ts");
            success = false;
        }
        callback(errors, success);
    }

    async loadExtension(): Promise<any> {
        let extensions: Array<any> = [];
        var files = fs.readdirSync(__dirname+'/extensions');
        for (const e of files){
            await import("./extensions/" + e + '/controller').then((ctrl) => {
                extensions.push(new ctrl.default(this.ExpressApp));
            });
        }
        return extensions;
    }

    registerMiddleware(element: any){
        this.ExpressApp.use((req: Request, res: Response, next: NextFunction) =>{
            if(element.path == '*'){
                if(!element.exception.includes(req.url.split('/')[1].toLowerCase())){
                    import("./controller/middleware/" + element.controller).then((ctrl) => {
                        new ctrl.default(req, res, next);
                    });
                }else{
                    next();
                }
            }else{
                if(element.path.endsWith('*')){
                    if((
                        element.type.includes(req.method.toLowerCase())
                        || element.type.includes(req.method.toUpperCase()))
                        && req.url.toLowerCase().startsWith(element.path.replace('/*', ''))
                        && !element.exception.includes(req.url.replace(element.path.replace('/*', '')+'/', '').split('/')[0]))
                    {
                        import("./controller/middleware/" + element.controller).then((ctrl) => {
                            new ctrl.default(req, res, next);
                        });
                    }else{
                        next();
                    }
                }else{
                    if((element.type.includes(req.method.toLowerCase())
                        || element.type.includes(req.method.toUpperCase()))
                        && element.path == req.url.toLowerCase())
                    {
                        import("./controller/middleware/" + element.controller).then((ctrl) => {
                            new ctrl.default(req, res, next);
                        });
                    }else{
                        next();
                    }
                }
            }
        });
    }

    async registerRoute(element: any){
        var type: string = element.type.toLowerCase() || 'get';
        if(['get', 'post', 'put', 'delete'].includes(type)){
            let controller = element.controller.split("::")
            await import("./controller/routes/" + controller[0]).then((ctrl) => {
                // @ts-ignore
                this.ExpressApp[type](element.path, (req: Request, res: Response) => {
                    new ctrl.default(req, res, controller[1]);
                });
            });
            console.log(`\x1b[33m[Info] > ${element.path} Registered`,'\x1b[0m')
        }else{
            console.log(`\x1b[31m[Error] > ${element.path} not registered method ${type} do not exists`,'\x1b[0m')
        }
    }

    registerErrorMiddleWare(){
        this.ExpressApp.use(function(req: express.Request, res: express.Response, next: express.NextFunction){
            import("./controller/errorController").then((ctrl)=>{
                new ctrl.default(req, res, next);
            });
        })
    }

    generateSiteMap(){
        sitemap.generate(this.ExpressApp); // generate sitemap from express route, you can set generate inside sitemap({})
        sitemap.XMLtoFile(__dirname+'/public/sitemap.xml'); // write this map to file
    }

    startServer(server: http.Server, port: number | undefined) {
        server.listen(process.env.APP_PORT || port, () => console.log("\x1b[32m[Info] > Server Running",'\x1b[0m'));
    }
}

const wald = new app(3000);
