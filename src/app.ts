import express from "express";
import fs from "fs";

export default class App {
  public app: express.Application;
  public port: number;

  constructor(controllersDir: string, middleware: any[], port: number) {
    this.app = express();
    this.port = port;
    this.initMiddleware(middleware);
    this.initControllers(controllersDir);
  }

  private initMiddleware(middlewares: express.Handler[]) {
    middlewares.forEach((middleware) => this.app.use(middleware));
  }

  private initControllers(controllersDir: string) {
    const files = fs.readdirSync(controllersDir);

    files.forEach((file) => {
      const module = this.fromFile(controllersDir + "/" + file);

      const instance = new module[file.split(".ts")[0]]();

      this.app.use("/", instance.router);
    });
  }

  public listen(callback: () => void) {
    this.app.listen(this.port, callback);
  }

  private fromFile(filepath: string) {
    return require(filepath);
  }
}
