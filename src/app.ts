import express, { NextFunction, Request, Response } from "express";
import fs from "fs";
import { Error } from "mongoose";
import Container, { Service } from "typedi";
import { BaseController } from "./model/BaseController";
import {join} from 'path'

@Service()
export default class App {
  public app: express.Application;
  public port: number;

  constructor(controllersDir: string, middleware: any[], port: number) {
    this.app = express();
    this.port = port;
    this.app.use('/static', express.static(join(__dirname, 'static')))
    this.initMiddleware(middleware);
    this.initControllers(controllersDir);
    this.app.use(this.onError.bind(this));
  }

  private initMiddleware(middlewares: express.Handler[]) {
    middlewares.forEach((middleware) => this.app.use(middleware));
  }

  private initControllers(controllersDir: string) {
    const files = fs.readdirSync(controllersDir);

    files.forEach((file) => {

      if(!file.includes('map')){

        const module = this.fromFile(controllersDir + "/" + file);

        const instance = Container.get<BaseController>(module[file.split(".js")[0]]);
  
        this.app.use("/", instance.router);

      }


    });
  }

  private onError(err: any, req: Request, res : Response, next : NextFunction){
    
    if(err.name === "UnauthorizedError"){
      res.status(401).send({success: false, err: 'Unauthorized'})
    }
    
    next();
  }

  public listen(callback: () => void) {
    this.app.listen(this.port, callback);
  }

  private fromFile(filepath: string) {
    return require(filepath);
  }
}
