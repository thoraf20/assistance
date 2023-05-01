import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as dotenv from'dotenv';
import * as cors from 'cors';
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import Controller from './interfaces/controller.interface';
import { myDataSource } from './config/db.config';

dotenv.config()

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    // this.connectToTheDatabase();
    this.initializeMiddlewares();
    // this.initializeSwaggerDoc();
    this.initializeControllers(controllers);
    // this.initializeErrorHandling();
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    this.app.use(cors());
    // this.app.use(loggerMiddleware);
    // const options = {
    //   definition: {
    //     openapi: "3.1.0",
    //     info: {
    //       title: "Assistance Doc",
    //       version: "0.1.0",
    //       description:
    //         "This is a assistance API application made with Express and documented with Swagger",
    //       license: {
    //         name: "MIT",
    //         url: "https://spdx.org/licenses/MIT.html",
    //       },
    //       contact: {
    //         name: "Toheeb Rauf",
    //         url: "",
    //         email: "thoraf20@email.com",
    //       },
    //     },
    //     servers: [
    //       {
    //         url: "http://localhost:2040",
    //         "description": "Local Dev"
    //       },
    //     ],
    //   },
    //   apis: ["./src/routes/**/*.ts"
    // ],
    // };

    // const specs = swaggerJsdoc(options);
    // this.app.use(
    //   "/api-docs",
    //   swaggerUi.serve,
    //   swaggerUi.setup(specs)
    // );
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/v1', controller.router);
    });
  }

  private connectToTheDatabase() {

    myDataSource
    .initialize()
    .then(() => {})
    .catch((err) => {
      console.error('Database connection error: ', err)
    })
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }
}

export default App;
