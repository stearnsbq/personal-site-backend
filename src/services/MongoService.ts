import { Service } from "typedi";
import mongoose from "mongoose";
import { getModelForClass, getModelWithString, ReturnModelType } from "@typegoose/typegoose";
import { AboutMe } from "../model/AboutMe";
import { Admin } from "../model/Admin";
import { BlogPost } from "../model/BlogPost";
import { Project } from "../model/Project";


@Service()
export class MongoService{
    private _mongoClient: typeof mongoose;

    private _aboutMe: ReturnModelType<typeof AboutMe>;
    private _admin : ReturnModelType<typeof Admin>;
    private _blog: ReturnModelType<typeof BlogPost>;
    private _project: ReturnModelType<typeof Project>;


    constructor(){
        this._aboutMe = getModelForClass(AboutMe);
        this._admin = getModelForClass(Admin);
        this._blog = getModelForClass(BlogPost);
        this._project = getModelForClass(Project);
    }

    public async connect(url: string){
        this._mongoClient = await mongoose.connect(url);
    }

    public get aboutMe(): ReturnModelType<typeof AboutMe> {
        return this._aboutMe;
    }

    public get admin(): ReturnModelType<typeof Admin> {
        return this._admin;
    }

    public get blog(): ReturnModelType<typeof BlogPost> {
        return this._blog;
    }

    public get project(): ReturnModelType<typeof Project> {
        return this._project;
    }

}