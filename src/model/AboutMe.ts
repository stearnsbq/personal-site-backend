import { modelOptions, prop } from "@typegoose/typegoose";
import { Document, model, Model, ObjectId, Schema, Types } from "mongoose";


export interface IAboutMe extends Document {
  aboutMe: string;
  education: string;
  experience: [Experience];
  certsAndLicenses: [CertsAndLicenses];
}

const schema = new Schema<IAboutMe>({
  aboutMe: { type: String, required: true },
  education: { type: String, required: true },
  experience: [
    {

    }
  ],
  certsAndLicenses: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      acquired: { type: Date, required: true },
      expiration: { type: Date, required: false }
    }
  ],
}, {capped: {size:999999, max:1}});


export class CertsAndLicenses {
  @prop()
  title: string;

  @prop()
  description: string;

  @prop()
  acquired: Date;

  @prop()
  expiration?: Date;
}



export class Experience{
  @prop()
  public title: string;

  @prop()
  public  company: string;

  @prop()
  public start: Date;

  @prop()
  public end?: Date;

  @prop({type: () => [String]})
  public bullets: string[];
}

export class Education{
  @prop()
  public degree: string;

  @prop()
  public school: string;

  @prop()
  public start: Date;

  @prop()
  public end?: Date;
}


@modelOptions({ schemaOptions: {capped: {max:1}}})
export class AboutMe{

  @prop()
  public _id: string; 

  @prop({required: true})
  public about: string;

  @prop({type: () => [Education]})
  public education: Education[];

  @prop({type: () => [Experience]})
  public experience : Experience[];

  @prop({type: () => [CertsAndLicenses]})
  public certsAndLicenses: CertsAndLicenses[];

}



