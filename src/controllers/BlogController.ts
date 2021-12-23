import { Service } from "typedi";
import { BaseController } from "../model/BaseController";
import express from "express";
import { isNumber } from "@typegoose/typegoose/lib/internal/utils";
import { JWT_MIDDLEWARE } from "../helpers/helpers";
import multer from "multer";
import { compile } from "html-to-text";
import { BlogPost } from "../model/BlogPost";

@Service()
export class BlogController extends BaseController {
  private readonly READ_SPEED = 200;

  constructor() {
    super();
    this.path = "/blog";
    this.initRoutes();
  }

  initRoutes(): void {
    const upload = multer({ dest: "./static" });

    this.router.get(
      `${this.path}/posts/:year?/:month?/:day?`,
      this.getBlogPosts.bind(this)
    );
    this.router.get(
      `${this.path}/posts/:year/:month/:day/:title`,
      this.getBlogPost.bind(this)
    );

    this.router.post(
      `${this.path}`,
      JWT_MIDDLEWARE,
      this.createBlogPost.bind(this)
    );
    this.router.post(
      `${this.path}/image`,
      JWT_MIDDLEWARE,
      upload.single("image"),
      this.uploadBlogImage.bind(this)
    );

    this.router.post(
      `${this.path}`,
      JWT_MIDDLEWARE,
      this.updateBlogPost.bind(this)
    );
  }

  private async uploadBlogImage(req: express.Request, res: express.Response) {
    try {
      const { post } = req.query;

      if (!post) {
        return res.status(400).json({ success: false, err: "missing post id" });
      }

      const image = req.file;

      const data = await this._mongo.blog.findOneAndUpdate(
        { _id: post as string },
        { image: image.path },
        { new: true }
      );

      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, err });
    }
  }

  private async createBlogPost(req: express.Request, res: express.Response) {
    try {
      const body = req.body as BlogPost;

      const convert = compile({
        wordwrap: 130,
      });

      const htmlText = convert(body.content);

      body.timeToRead = Math.floor(this.countWords(htmlText) / this.READ_SPEED);
      body.created = new Date();
      body.lastUpdated = new Date();

      const data = await this._mongo.blog.create(body);

      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, err });
    }
  }

  private async updateBlogPost(req: express.Request, res: express.Response) {}

  private async getBlogPosts(req: express.Request, res: express.Response) {
    try {
      const [year, month, day] = Object.values(req.params).map((val) =>
        isNumber(val) ? parseInt(val) : null
      );

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
        params["created"] = new Date(year, month - 1, day);
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

      if ([year, month, day].some((value: string) => !isNumber(value))) {
        return res
          .status(400)
          .send({ success: false, err: `Invalid values provided` });
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

      res
        .status(200)
        .send({
          success: true,
          message: `Post ${post.title} retrieved!`,
          data: post,
        });

      post.views++; // update view counter

      await post.save();
    } catch (err) {
      res.status(500).send({ success: false, err });
    }
  }

  private countWords(string: string) {
    return string
      .replace(/[.,?!;()"'-]/g, " ")
      .replace(/\s+/g, " ")
      .toLowerCase()
      .split(" ").length;
  }
}
