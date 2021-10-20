import { Service } from "typedi";
import { BaseController } from "../model/BaseController";
import express from "express";

@Service()
export class BlogController extends BaseController {
  constructor() {
    super();
    this.path = "/blog";
    this.initRoutes();
  }

  initRoutes(): void {
    this.router.get(
      `${this.path}/posts/:year?/:month?/:day?`,
      this.getBlogPosts.bind(this)
    );
    this.router.get(
      `${this.path}/posts/:year/:month/:day/:title`,
      this.getBlogPost.bind(this)
    );
  }

  private async getBlogPosts(req: express.Request, res: express.Response) {
    try {
        const {year, month, day} = req.params;

        const {search} = req.query;


        const params: any = {};


        if(search){
            params['title'] = {$regex: `/${search}/i`}
        }

        if(year){
            params['lastUpdated'] = {$regex: `/${year}/i`}
        }

        if(month){
            params['lastUpdated'] = {$regex: `/${year}-${month}/i`}
        }

        if(day){
            params['lastUpdated'] = {$regex: `/${year}-${month}-${day}/i`}
        }


        const posts = this._mongo.blog.find(params, "title description created lastUpdated timeToRead image").exec()

      res.status(200).send({ success: true, data: posts });
    } catch (err) {
      console.error(err)
      res.status(500).send({ success: false, err });
    }
  }

  private async getBlogPost(req: express.Request, res: express.Response) {
    try {
      res.status(200).send({ success: true, data: {} });
    } catch (err) {
      res.status(500).send({ success: false, err });
    }
  }
}
