import { Request, Response } from "express";
import { AboutMe } from "../model/AboutMe";
import { Inject, Service } from "typedi";
import { BaseController } from "../model/BaseController";
import jwt from 'express-jwt'

@Service()
export class AboutMeController extends BaseController {
  constructor() {
    super();
    this.path = "/about";
    this.initRoutes();
  }

  initRoutes(): void {
    this.router.get(this.path, this.getAboutMe.bind(this));
    this.router.put(this.path, jwt({secret: process.env.JWT_SECRET, algorithms: ['HS256']}), this.updateAboutMe.bind(this));
  }

  async getAboutMe(req: Request, res: Response) {
    try {
      const aboutMe = await this._mongo.aboutMe.findOne({}, '-_id -__v -education._id -experience._id -certsAndLicenses._id');
      res.status(200).send({ success: true, message: "About me retrieved!", data: aboutMe });
    } catch (err) {
      res.status(500).send({ success: false, err });
    }
  }

  async updateAboutMe(req: Request, res: Response) {
    try {
      const body = req.body as AboutMe;

      const aboutMe = await this._mongo.aboutMe.findOneAndUpdate(
        {},
        body,
        { upsert: true, new: true }
      );
      res.status(200).send({ success: true, message: "About me updated!", data: aboutMe });
    } catch (err) {
      res.status(500).send({ success: false, message: "Failed to update about me!", err });
    }
  }
}
