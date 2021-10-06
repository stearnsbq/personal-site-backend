import { Document, model, Model, Schema, Types } from "mongoose";

export interface IProject extends Document{
    title: string,
    description: string;
    created: Date,
    lastUpdated: Date,
    forks: number,
    stars: number,
    images: [string]
}


const schema = new Schema<IProject>({
    title: {type: String, required: true},
    created: {type: Date, required: true},
    lastUpdated: {type: Date, required: true},
    forks: {type: Number, required: true},
    stars: {type: Number, required: true},
    images: {type: [String], required: true}
})



export const Project : Model<IProject> = model('Project', schema);