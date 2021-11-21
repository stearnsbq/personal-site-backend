import { index, modelOptions, prop } from "@typegoose/typegoose";



@index({expireAt: 1}, {expireAfterSeconds: 0})
export class RevokedToken {
    @prop({required: true, unique: true})
    token: string;

    @prop({required: true})
    expireAt: Date;
}

