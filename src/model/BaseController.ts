import express from 'express';
import { MongoService } from '../services/MongoService';
import { Inject } from 'typedi';

export abstract class BaseController{
    @Inject()
    protected _mongo: MongoService
    public path: string;
    public router = express.Router();



    abstract initRoutes() : void;
    
}