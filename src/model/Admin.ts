import { prop } from "@typegoose/typegoose";


export class Admin {
    @prop({required: true, unique: true})
    public username!: string;

    @prop({required: true})
    public password!: string;
}

