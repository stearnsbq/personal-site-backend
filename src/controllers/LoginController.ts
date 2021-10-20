import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { Service } from "typedi";
import { BaseController } from "../model/BaseController";

@Service()
export class LoginController extends BaseController {
  constructor() {
    super();
    this.path = "/auth";
    this.initRoutes();
  }

  initRoutes(): void {
    this.router.post(this.path + "/login", this.login.bind(this));
  }

  public async login(req: Request, res: Response) {
    try {
      const body = req.body as { username: string; password: string };

      const user = await this._mongo.admin.findOne({ username: body.username });

      if (
        !user ||
        (user && !(await argon2.verify(user.password, body.password)))
      ) {
        return res.status(401).send({ success: false, err: "Unauthorized" });
      }

      const token = jwt.sign(
        { username: body.username },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      return res.status(200).send({ success: true, data: token });
    } catch (err) {
      return res.status(500).send({ success: false, err });
    }
  }
}
