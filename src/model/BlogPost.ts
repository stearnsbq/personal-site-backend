import { prop } from "@typegoose/typegoose";

export class BlogPost {

    @prop({required: true, unique: true})
    public title!: string;

    @prop({default: ''})
    public description!: string;
    
    @prop({required: true})
    public created!: Date;

    @prop({required: true})
    public lastUpdated!: Date;

    @prop({required: true})
    public timeToRead!: number;

    @prop({default: ''})
    public image!: string;

    @prop({required: true})
    public content!: string;

    @prop({default: 0})
    public views: number;

    @prop({ type: () => [String], default: [] })
    public tags: string[];

}


