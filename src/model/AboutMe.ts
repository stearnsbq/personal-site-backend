import { Document, model, Model, Schema, Types } from "mongoose";

export interface Experience {
  title: string;
  company: string;
  start: Date;
  end?: Date;
  bullets: string[];
}

export interface CertsAndLicenses {
  title: string;
  description: string;
  acquired: Date;
  expiration?: Date;
}

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
      title: { type: String, required: true },
      company: { type: String, required: true },
      start: { type: Date, required: true },
      end: { type: Date, required: false },
      bullets: { type: [String], required: true },
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



export const AboutMe: Model<IAboutMe> = model("AboutMe", schema);
