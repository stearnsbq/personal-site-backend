import { prop } from "@typegoose/typegoose";

export class Project {
    @prop({required: true, unique: true})
    title: string;

    @prop()
    githubURL?: string;

    @prop()
    description?: string;

    @prop()
    githubID?: string;
    
    @prop({required: true})
    created: Date;

    @prop({required: true})
    lastUpdated: Date;

    @prop({required: true})
    forks: number;

    @prop({required: true})
    stars: number;

    @prop({ type: () => [String], default: [] })
    languages: string[];
}

