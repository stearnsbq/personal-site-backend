import { Request, Response } from "express";
import { Service } from "typedi";
import { BaseController } from "../model/BaseController";

@Service()
export class ProjectController extends BaseController {
  constructor() {
    super();
    this.path = "/projects";
    this.initRoutes();
  }

  initRoutes(): void {
    this.router.get("/", this.getProjects.bind(this));
    this.router.get("/:title", this.getProject.bind(this));
  }

  private async getProjects(req: Request, res: Response) {
    try {
      const projects = await this._mongo.project
        .find(
          {},
          "title description created lastUpdated forks stars images githubURL"
        )
        .exec();

      res
        .status(200)
        .send({
          success: true,
          message: `Projects retrieved!`,
          data: projects,
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
        .send({ success: true, message: `Projects retrieved!`, data: project });
    } catch (err) {
      res.status(500).send({ success: false, err });
    }
  }
}
