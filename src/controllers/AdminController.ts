import { Request, Response } from "express";
import { Service } from "typedi";
import {hash} from 'argon2';
import jwt from 'express-jwt'
import { BaseController } from "../model/BaseController";

@Service()
export class AdminController extends BaseController {
  constructor() {
    super();
    this.path = "/admin";
    this.initRoutes();
  }

  initRoutes(): void {
    this.router.post('/create', jwt({secret: process.env.JWT_SECRET, algorithms: ['HS256']}), this.createAccount.bind(this))
  }



  private async createAccount(req: Request, res: Response){

    try{

      const {username, password} = req.body as {username: string, password: string}

      const passwordHash = await hash(password);

      const account = await this._mongo.admin.create({username, password: passwordHash})

      account.save();

      res.status(200).send({ success: true, message: "Account successfully created!" });
    }catch(err){
      res.status(500).send({ success: false, message: "Account creation failed!", err });
    }

  }




}
