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
    this.router.post(this.path + "/logout", this.logout.bind(this));
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


  public async logout(req: Request, res: Response){
    try {

      const {authorization} = req.headers;

      const token = authorization.split("Bearer ")[1];

      if(!token){
        return res.status(400).send({ success: false, message: 'Missing token!' });
      }

      const decoded = jwt.decode(token) as any;

      const sig = token.split('.')[2];


      if(await this._mongo.revokedToken.findOne({token: sig})){
        return res.status(400).send({ success: false, message: 'You already logged out!' });
      }



      await this._mongo.revokedToken.create({token: sig, expireAt: new Date(decoded.exp * 1000)});

      return res.status(200).send({ success: true, message: 'Logged out successfully!' });
    } catch (err) {
      return res.status(500).send({ success: false, err });
    }
  }

}
