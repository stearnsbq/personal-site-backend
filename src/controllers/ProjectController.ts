import { Service } from "typedi";
import { BaseController } from "../model/BaseController";

@Service()
export class ProjectController extends BaseController{


    constructor(){
        super();
        this.path = '/projects'
        this.initRoutes();
    }


    initRoutes(): void {

    }


 

}