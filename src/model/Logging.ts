import { Document, model, Model, Schema, Types } from "mongoose";


export interface ILog extends Document {
    timestamp: Date;
    type: string;
    content: string;
}

const schema = new Schema<ILog>({
    timestamp: { type: Date, required: true },
    type: { type: String, required: true },
    content: { type: String, required: true },
});

export const Logging: Model<ILog> = model("Logging", schema);
