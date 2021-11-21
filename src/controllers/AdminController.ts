import { Request, Response } from "express";
import { Service } from "typedi";
import {hash} from 'argon2';
import jwt from 'express-jwt'
import { BaseController } from "../model/BaseController";
import { JWT_MIDDLEWARE } from "../helpers/helpers";

@Service()
export class AdminController extends BaseController {
  constructor() {
    super();
    this.path = "/admin";
    this.initRoutes();
  }

  initRoutes(): void {
    this.router.post(this.path + '/create', JWT_MIDDLEWARE, this.createAccount.bind(this))
  }



  private async createAccount(req: Request, res: Response){

    try{

      const {username, password} = req.body as {username: string, password: string}

      if(await this._mongo.admin.findOne({username})){
        return res.status(400).send({ success: false, message: "Admin already exists!" });
      }

      const passwordHash = await hash(password);

      const account = await this._mongo.admin.create({username, password: passwordHash})

      account.save();

      return res.status(200).send({ success: true, message: "Account successfully created!" });
    }catch(err){
      res.status(500).send({ success: false, message: "Account creation failed!", err });
    }

  }




}
