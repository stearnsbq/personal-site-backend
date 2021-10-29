import { Service } from "typedi";
import { BaseController } from "../model/BaseController";
import express from "express";
import { isNumber } from "@typegoose/typegoose/lib/internal/utils";

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
      const [ year, month, day ] = Object.values(req.params).map((val) => isNumber(val) ? parseInt(val) : null);

      const { search } = req.query;

      const params: any = {};

      if (search) {
        params["title"] = { $regex: `/${search}/i` };
      }

      if (year) {
        params["created"] = {
          $gte: new Date(year, 0, 1),
          $lte: new Date(year, 12, 0),
        };
      }

      if (month) {
        params["created"] = {
          $gte: new Date(year, month - 1, 1),
          $lte: new Date(year, month, 0),
        };
      }

      if (day) {
        params["created"] = new Date(
          year,
          month - 1,
          day
        );
      }

      const posts = this._mongo.blog
        .find(params, "title description created lastUpdated timeToRead image")
        .exec();

      res.status(200).send({ success: true, data: posts });
    } catch (err) {
      console.error(err);
      res.status(500).send({ success: false, err });
    }
  }

  private async getBlogPost(req: express.Request, res: express.Response) {
    try {
      const { year, month, day, title } = req.params;


      if([year, month, day].some((value: string) => !isNumber(value))){
        return res.status(400).send({ success: false, err: `Invalid values provided` });
      }


      const post = await this._mongo.blog
        .findOne(
          {
            title,
            created: new Date(
              parseInt(year),
              parseInt(month) - 1,
              parseInt(day)
            ),
          },
          "title description created lastUpdated timeToRead image content"
        )
        .exec();

      res.status(200).send({ success: true, message: `Post ${post.title} retrieved!`, data: post });
    } catch (err) {
      res.status(500).send({ success: false, err });
    }
  }
}
