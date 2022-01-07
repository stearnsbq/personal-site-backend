import { Service } from "typedi";
import { BaseController } from "../model/BaseController";
import express from "express";
import { isNumber } from "@typegoose/typegoose/lib/internal/utils";
import { JWT_MIDDLEWARE, BLOG_MULTER_STORAGE } from "../helpers/helpers";
import multer from "multer";
import { compile, convert } from "html-to-text";
import { BlogPost } from "../model/BlogPost";
import { MongoServerError } from "mongodb";
import bind from "bind-decorator";

@Service()
export class BlogController extends BaseController {
  private readonly READ_SPEED = 200;

  constructor() {
    super();
    this.path = "/blog";
    this.initRoutes();
  }

  initRoutes(): void {
    const upload = multer({ storage: BLOG_MULTER_STORAGE });

    this.router.get(`${this.path}/tags`, this.getTags);

    this.router.get(`${this.path}/archives`, this.getArchives);

    this.router.get(
      `${this.path}/posts/:year?/:month?/:day?`,
      this.getBlogPosts
    );

    this.router.get(`${this.path}/post/:post`, this.getBlogPostByID);

    this.router.get(
      `${this.path}/posts/:year/:month/:day/:title`,
      this.getBlogPost
    );

    this.router.put(`${this.path}/post/:post`, this.updateBlogPost);

    this.router.post(`${this.path}`, JWT_MIDDLEWARE, this.createBlogPost);

    this.router.post(
      `${this.path}/image`,
      JWT_MIDDLEWARE,
      upload.single("image"),
      this.uploadBlogImage
    );

    this.router.post(`${this.path}`, JWT_MIDDLEWARE, this.updateBlogPost);
  }

  @bind
  private async getArchives(req: express.Request, res: express.Response) {
    try {
      const archives = await this._mongo.blog.aggregate([
        {
          $group: {
            _id: { year: { $year: "$created" }, month: { $month: "$created" } },
            count: {$sum: 1}
          },
        },
        {
          $group: {
            _id: "$_id.year",
            months: {
              $push: { month: {$toString: "$_id.month"}, count: "$count" },
            },
          },
        },
        {$project: {_id: 0, year: {$toString: "$_id"}, months: 1}}
      ]);

      return res.status(200).json({ success: true, data: archives });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, err });
    }
  }

  @bind
  private async getTags(req: express.Request, res: express.Response) {
    try {

      const [year, month, day] = Object.values(req.query).map((val) =>
       parseInt(val as string)
     );

      const params: any = {};

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


      const tags = await this._mongo.blog.aggregate([
        {$match: params},
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        {$project: {_id: 0, tag: "$_id", count: 1}}
      ]);

      return res.status(200).json({
        success: true,
        data: tags
      });
    } catch (err) {
      return res.status(500).json({ success: false, err });
    }
  }

  @bind
  private async uploadBlogImage(req: express.Request, res: express.Response) {
    try {
      const { post } = req.query;

      if (!post) {
        return res.status(400).json({ success: false, err: "missing post id" });
      }

      const image = req.file;

      const data = await this._mongo.blog.findOneAndUpdate(
        { _id: post as string },
        { image: image.filename },
        { new: true }
      );

      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, err });
    }
  }

  @bind
  private async createBlogPost(req: express.Request, res: express.Response) {
    try {
      const body = req.body as BlogPost;

      const convert = compile({
        wordwrap: 130,
      });

      const htmlText = convert(body.content);

      const now = new Date(new Date().toDateString());

      body.timeToRead = Math.floor(this.countWords(htmlText) / this.READ_SPEED);
      body.created = now;
      body.lastUpdated = now;
      body.views = 0;

      const data = await this._mongo.blog.create(body);

      return res.status(200).json({ success: true, data });
    } catch (err) {
      //console.error(err)

      if (err instanceof MongoServerError) {
        switch (err.code) {
          case 11000: {
            return res.status(409).json({
              success: false,
              err: `Post with title ${req.body.title} already exists!`,
            });
          }
        }
      }

      return res.status(500).json({ success: false, err });
    }
  }

  @bind
  private async updateBlogPost(req: express.Request, res: express.Response) {
    try {
      const { post } = req.params;

      const { body } = req;

      if (!post) {
        return res
          .status(500)
          .json({ success: false, err: "Missing post ID!" });
      }

      const htmlText = convert(body.content);

      body.timeToRead = Math.floor(this.countWords(htmlText) / this.READ_SPEED);

      body.lastUpdated = new Date(new Date().toDateString());

      const result = await this._mongo.blog.findOneAndUpdate(
        { _id: post },
        body,
        { new: true }
      );

      if (!result) {
        return res.status(404).json({ success: false, err: "Post not found!" });
      }

      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      return res.status(500).json({ success: false, err });
    }
  }

  @bind
  private async getBlogPosts(req: express.Request, res: express.Response) {
    try {
      const [year, month, day] = Object.values(req.params).map((val) =>
        parseInt(val)
      );

      const { search, tag } = req.query;

      const params: any = {};

      if(tag){
        params["tags"] = tag
      }

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

      const posts = await this._mongo.blog
        .find(
          params,
          "title description created lastUpdated timeToRead image views"
        )
        .exec();

      res.status(200).send({ success: true, data: posts });
    } catch (err) {
      console.error(err);
      res.status(500).send({ success: false, err });
    }
  }

  @bind
  private async getBlogPostByID(req: express.Request, res: express.Response) {
    try {
      const post = await this._mongo.blog.findOne({ _id: req.params.post });

      return res.status(200).json({ success: true, data: post });
    } catch (err) {
      return res.status(500).json({ success: false, err });
    }
  }

  @bind
  private async getBlogPost(req: express.Request, res: express.Response) {
    try {
      const { year, month, day, title } = req.params;

      if ([year, month, day].some((value: string) => !/^-?\d+$/.test(value))) {
        return res
          .status(400)
          .send({ success: false, err: `Invalid values provided` });
      }

      const post = await this._mongo.blog.findOne(
        {
          title,
          created: new Date(`${year}/${month}/${day}`),
        },
        "title description created lastUpdated timeToRead image content views"
      );

      post.views++; // update view counter

      await post.save();

      res.status(200).send({
        success: true,
        message: `Post ${post.title} retrieved!`,
        data: post,
      });
    } catch (err) {
      console.error(err);
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
