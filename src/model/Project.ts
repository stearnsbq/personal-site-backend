import { prop } from "@typegoose/typegoose";

export class Project {
    @prop({required: true})
    title: string;

    @prop({required: true})
    description: string;

    @prop()
    githubURL?: string;

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

    @prop({type: () => [String]})
    images: string[];
}

