import { Request, Response } from "express";
import { AboutMe } from "../model/AboutMe";
import { Service } from "typedi";
import { BaseController } from "../model/BaseController";

@Service()
export class AboutMeController extends BaseController {
  constructor() {
    super();
    this.path = "/about";
    this.initRoutes();
  }

  initRoutes(): void {
    this.router.get(this.path, this.getAboutMe.bind(this));
  }

  async getAboutMe(req: Request, res: Response) {
      try{
          const aboutMe = await AboutMe.find({})
          res.status(200).send({success: true, data: aboutMe[0]})
      }catch(err){
          res.status(500).send({success: false, err})
      }
  }
}
