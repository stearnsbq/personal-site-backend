import { Request, Response } from "express";
import { Service } from "typedi";
import {hash} from 'argon2';
import { BaseController } from "../model/BaseController";

@Service()
export class AdminController extends BaseController {
  constructor() {
    super();
    this.path = "/admin";
    this.initRoutes();
  }

  initRoutes(): void {
    this.router.post('/create', this.createAccount.bind(this))
  }



  private async createAccount(req: Request, res: Response){

    try{

      const body = req.body as {username: string, password: string}

      const passwordHash = await hash(body.password);

      const account = await this._mongo.admin.create({username: body.username, password: passwordHash})

      account.save();

      res.status(200).send({ success: true });
    }catch(err){
      res.status(500).send({ success: false, err });
    }

  }




}
