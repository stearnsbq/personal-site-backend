import { MongoClient } from "mongodb";
import { Service } from "typedi";
import mongoose, { Mongoose } from 'mongoose';

@Service()
export class MongoService{
    private client : Mongoose;


    public async connect(uri: string){
        this.client = await mongoose.connect(uri);
    }




}