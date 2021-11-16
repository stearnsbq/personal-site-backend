import { Request, Response } from "express";
import jwt from "express-jwt";
import { Service } from "typedi";
import { BaseController } from "../model/BaseController";
import {Project} from '../model/Project'

@Service()
export class ProjectController extends BaseController {
  constructor() {
    super();
    this.path = "/projects";
    this.initRoutes();
  }

  initRoutes(): void {
    this.router.get(this.path, this.getProjects.bind(this));
    this.router.get(this.path + "/:title", this.getProject.bind(this));
    this.router.post(this.path, jwt({secret: process.env.JWT_SECRET, algorithms: ['HS256']}), this.upsertProject.bind(this));
  }

  private async getProjects(req: Request, res: Response) {
    try {
      const projects = await this._mongo.project
        .find(
          {},
          "-_id -__v"
        )
        .exec();

      res
        .status(200)
        .send({
          success: true,
          message: `Projects retrieved!`,
          data: projects ?? [],
        });
    } catch (err) {
      res.status(500).send({ success: false, err });
    }
  }

  private async getProject(req: Request, res: Response) {
    try {
      const { title } = req.params;

      const project = await this._mongo.project
        .findOne(
          { title },
          "title description created lastUpdated forks stars images githubURL"
        )
        .exec();

      res
        .status(200)
        .send({ success: true, message: `Project retrieved!`, data: project ?? {} });
    } catch (err) {
      res.status(500).send({ success: false, err });
    }
  }



  private async upsertProject(req: Request, res: Response){
    try {
      const body = req.body as Project;

      const project = await this._mongo.project.create(body)

      res
        .status(200)
        .send({ success: true, message: `Project Created!`, data: project });
    } catch (err) {
      res.status(500).send({ success: false, err });
    }
  }

}
