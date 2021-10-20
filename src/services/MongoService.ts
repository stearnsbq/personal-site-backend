import { Service } from "typedi";
import mongoose from "mongoose";
import { getModelForClass, getModelWithString, ReturnModelType } from "@typegoose/typegoose";
import { AboutMe } from "../model/AboutMe";
import { Admin } from "../model/Admin";
import { BlogPost } from "../model/BlogPost";


@Service()
export class MongoService{
    private _mongoClient: typeof mongoose;

    private _aboutMe: ReturnModelType<typeof AboutMe>;
    private _admin : ReturnModelType<typeof Admin>;
    private _blog: ReturnModelType<typeof BlogPost>;


    constructor(){

        this._aboutMe = getModelForClass(AboutMe);
        this._admin = getModelForClass(Admin);
        this._blog = getModelForClass(BlogPost);
        console.log(this._aboutMe, this._admin, this._blog)
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

}