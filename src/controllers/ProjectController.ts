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
    this.router.post(this.path, jwt({secret: process.env.JWT_SECRET, algorithms: ['HS256']}), this.upsertProject.bind(this));
  }

  private async getProjects(req: Request, res: Response) {
    try {

      const {search, page} = req.query as {search: string, page: string};

      const searchParams = search ? { $or: [ {title: {$regex: search, $options: 'i'}}, {description: {$regex: search, $options: 'i'}} ]} : {}

      const projects = await this._mongo.project
        .find(
          searchParams,
          "-_id -__v"
        ).skip(12 * Math.max(0, parseInt(page)))
        .limit(12)
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
