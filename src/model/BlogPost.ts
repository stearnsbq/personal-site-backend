import { Document, model, Model, Schema, Types } from "mongoose";

export interface IBlogPost extends Document{
    _id: string,
    title: string,
    description: string;
    created: Date,
    lastUpdated: Date,
    timeToRead: number;
    image: string;
    content: string;
}


const schema = new Schema<IBlogPost>({
    _id: {type: String, required: true},
    title: {type: String, required: true},
    created: {type: Date, required: true},
    lastUpdated: {type: Date, required: true},
    timeToRead: {type: Number, required: true},
    image: {type: String, required: true},
    content: {type: String, required: true},
})



const BlogPost : Model<IBlogPost> = model('BlogPost', schema);