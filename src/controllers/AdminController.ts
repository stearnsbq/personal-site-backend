import { Request, Response } from "express";
import { AboutMe } from "../model/AboutMe";
import { Service } from "typedi";
import { BaseController } from "../model/BaseController";

@Service()
export class AdminController extends BaseController {
  constructor() {
    super();
    this.path = "/admin";
    this.initRoutes();
  }

  initRoutes(): void {

  }

  

}
