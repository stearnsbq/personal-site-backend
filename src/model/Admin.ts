import { Document, model, Model, Schema, Types } from "mongoose";


export interface IAdmin extends Document {
    username: string;
    password: string;
}

const schema = new Schema<IAdmin>({
    username: { type: String, required: true },
    password: { type: String, required: true },
});

export const Logging: Model<IAdmin> = model("Admins", schema);
