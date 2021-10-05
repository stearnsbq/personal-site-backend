import { Document, model, Model, Schema, Types } from "mongoose";

export interface IProject extends Document{
    _id: string,
    title: string,
    description: string;
    created: Date,
    lastUpdated: Date,
    image: string;
}


const schema = new Schema<IProject>({
    _id: {type: String, required: true},
    title: {type: String, required: true},
    created: {type: Date, required: true},
    lastUpdated: {type: Date, required: true},
    image: {type: String, required: true},
})



const Project : Model<IProject> = model('Project', schema);