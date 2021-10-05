import { Service } from "typedi";
import { BaseController } from "../model/BaseController";

@Service()
export class GitWebhookController extends BaseController{


    constructor(){
        super();
        this.path = '/webhooks/git'
        this.initRoutes();
    }


    initRoutes(): void {

    }


    // ROUTES

}