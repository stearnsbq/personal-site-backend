import { Service } from "typedi";
import { BaseController } from "../model/BaseController";

@Service()
export class AboutMeController extends BaseController{


    constructor(){
        super();
        this.path = '/about'
        this.initRoutes();
    }


    initRoutes(): void {

    }


    // ROUTES

}