import { prop } from "@typegoose/typegoose";

export class BlogPost {
    @prop({required: true})
    public title!: string;

    @prop({required: true})
    public description!: string;
    
    @prop({required: true})
    public created!: Date;

    @prop({required: true})
    public lastUpdated!: Date;

    @prop({required: true})
    public timeToRead!: number;

    @prop({required: true})
    public image!: string;

    @prop({required: true})
    public content!: string;

    @prop({default: 0})
    public views: number;

}


