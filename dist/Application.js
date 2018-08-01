"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const moment = require("moment");
const compression = require("compression");
const underscore = require("underscore");
const multer = require("multer");
const flash = require("connect-flash");
const sequelize_typescript_1 = require("sequelize-typescript");
const passport = require("passport");
const back = require("express-back");
const kd = require("khong-dau");
class Application {
    constructor() {
        this._app = express();
        // Load package
        this.loadPackage();
        // Set view engine
        this.setViewEngine();
        // Load local modules for view
        this.loadViewModule();
        // Load model
        this.loadModel();
        // Load controller
        this.loadController();
    }
    get app() {
        return this._app;
    }
    set app(value) {
        this._app = value;
    }
    loadPackage() {
        // Use connect-flash
        this._app.use(flash());
        // Use session
        this._app.set("trust proxy", 1);
        this._app.use(session({
            secret: 'BN1SPEAeeWywcEuxyh0hCcpPwumUx3hx1qJcLJGuYlRMcyrCdj71XZBBLO7I',
            resave: true,
            saveUninitialized: true
        }));
        // Use multer
        this._app.use(multer({ dest: path.join(Application.PUBLIC_DIR, "document/raw") }).any());
        // Use body parser
        this._app.use(bodyParser.urlencoded({
            extended: true
        }));
        this._app.use(bodyParser.json());
        // Use cookie parser
        this._app.use(cookieParser());
        //Use passport
        this._app.use(passport.initialize());
        this._app.use(passport.session());
        //Use express-back
        this._app.use(back());
    }
    setViewEngine() {
        this._app.set('view engine', 'pug');
        this._app.set('views', Application.VIEW_DIR);
        this._app.use("/", express.static(Application.PUBLIC_DIR, { maxAge: 365 * 24 * 60 * 60 * 1000 }));
    }
    loadViewModule() {
        // Load Compression
        this._app.use(compression());
        // Load Moment
        this._app.locals.moment = moment;
        this._app.locals.moment.locale('vi');
        // Load khong-dau
        this._app.locals.KhongDau = kd;
        // Load Underscore
        this._app.locals.underscore = underscore;
    }
    loadModel() {
        const sequelize = new sequelize_typescript_1.Sequelize({
            host: "localhost",
            port: 5432,
            name: "kogida",
            dialect: "postgres",
            username: "postgres",
            password: "Trong123",
            storage: ":memory:",
            modelPaths: [Application.MODEL_DIR]
        });
    }
    loadController() {
        const moduleList = fs.readdirSync(Application.MODULE_DIR);
        for (var index = 0; index < moduleList.length; index++) {
            var module = moduleList[index];
            console.log(`Init: load controller => ${module}`);
            var router = this._app._router;
            require(path.join(Application.MODULE_DIR, module, "controller")).default.route(router);
        }
    }
}
Application.VIEW_DIR = path.join(__dirname, "./layout/");
Application.MODEL_DIR = path.join(__dirname, "./model/");
Application.MODULE_DIR = path.join(__dirname, "./module/");
Application.SERVICE_DIR = path.join(__dirname, "./service/");
Application.PUBLIC_DIR = path.join(path.dirname(__dirname), "/public");
exports.default = Application;
