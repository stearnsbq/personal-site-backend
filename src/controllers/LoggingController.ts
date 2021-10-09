import { Request, Response } from "express";
import { AboutMe } from "../model/AboutMe";
import { Service } from "typedi";
import { BaseController } from "../model/BaseController";
import { Logging } from "../model/Logging";

@Service()
export class LoggingController extends BaseController {
  constructor() {
    super();
    this.path = "/logging";
    this.initRoutes();
  }

  initRoutes(): void {
    this.router.get(this.path, this.getLogs.bind(this));
  }

  async getLogs(req: Request, res: Response) {
      try{
          const logs = await Logging.find({})
          res.status(200).send({success: true, data: logs})
      }catch(err){
          res.status(500).send({success: false, err})
      }
  }
}
