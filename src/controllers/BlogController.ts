import { Service } from "typedi";
import { BaseController } from "../model/BaseController";
import express from 'express';

@Service()
export class BlogController extends BaseController{


    constructor(){
        super();
        this.path = '/blog'
        this.initRoutes();
    }


    initRoutes(): void {
        this.router.get(`${this.path}/posts`, this.getAllBlogPosts.bind(this))
        this.router.get(`${this.path}/posts/:year`, this.getBlogPostsByYear.bind(this))
        this.router.get(`${this.path}/posts/:year/:month`, this.getBlogPostsByMonth.bind(this))
        this.router.get(`${this.path}/posts/:year/:month/:day`, this.getBlogPostsByDay.bind(this))
        this.router.get(`${this.path}/posts/:year/:month/:day/:title`, this.getBlogPost.bind(this))
    }


    // ROUTES

    private getAllBlogPosts(req: express.Request, res: express.Response){

    }

    private getBlogPostsByYear(req: express.Request, res: express.Response){

    }

    private getBlogPostsByMonth(req: express.Request, res: express.Response){

    }

    private getBlogPostsByDay(req: express.Request, res: express.Response){

    }

    private getBlogPost(req: express.Request, res: express.Response){

    }

}