import * as express from "express"
import * as bodyParser from "body-parser"
import * as morgan from "morgan"
import * as cookieParser from "cookie-parser"
import * as path from "path"
import * as fs from "fs"
import * as session from "express-session"
import * as moment from "moment"
import * as compression from "compression"
import * as underscore from "underscore"
import * as multer from "multer"
import flash = require("connect-flash")
import {Sequelize} from 'sequelize-typescript';
import * as passport from 'passport'
import * as back from 'express-back'
import * as kd from 'khong-dau'

export default class Application {
    private _app: express.Application;

    public static VIEW_DIR = path.join(__dirname, "./layout/");
    public static MODEL_DIR = path.join(__dirname, "./model/");
    public static MODULE_DIR = path.join(__dirname, "./module/");
     public static SERVICE_DIR = path.join(__dirname, "./service/");
    public static PUBLIC_DIR = path.join(path.dirname(__dirname), "/public");

	public get app(): express.Application {
		return this._app;
	}

	public set app(value: express.Application) {
		this._app = value;
	}
    
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

    private loadPackage(): void {
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
        this._app.use(multer({ dest: path.join(Application.PUBLIC_DIR, "document/raw")}).any());

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

    private setViewEngine(): void {
        this._app.set('view engine', 'pug');
        this._app.set('views', Application.VIEW_DIR);

        this._app.use("/", express.static(Application.PUBLIC_DIR, { maxAge: 365 * 24 * 60 * 60 * 1000 }))
    }

    private loadViewModule(): void {
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
    
    private loadModel(): void {
        const sequelize = new Sequelize({
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

    private loadController(): void {
        const moduleList = fs.readdirSync(Application.MODULE_DIR);

        for (var index = 0; index < moduleList.length; index++) {
            var module = moduleList[index];
            console.log(`Init: load controller => ${module}`);

            var router = this._app._router;
            require(path.join(Application.MODULE_DIR, module, "controller")).default.route(router);
        }
    }

}
