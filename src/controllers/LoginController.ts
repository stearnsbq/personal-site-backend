import { Request, Response } from "express";
import { Service } from "typedi";
import { BaseController } from "../model/BaseController";

@Service()
export class LoginController extends BaseController{


    constructor(){
        super();
        this.path = '/auth'
        this.initRoutes();
    }


    initRoutes(): void {
        this.router.post(this.path + '/login', this.login.bind(this))
    }

    public login(req: Request, res : Response){

    }

}