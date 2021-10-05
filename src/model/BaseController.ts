import express from 'express';

export abstract class BaseController{
    public path: string;
    public router = express.Router();


    abstract initRoutes() : void;
    
}