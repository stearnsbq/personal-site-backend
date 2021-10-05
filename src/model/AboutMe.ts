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
  _id: string;
  aboutMe: string;
  education: string;
  experience: [Experience];
  certsAndLicenses: [CertsAndLicenses];
  version: number;
  created: Date;
}

const schema = new Schema<IAboutMe>({
  _id: { type: String, required: true },
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
  version: { type: Number, required: true },
  created: { type: Date, required: true },
});

const AboutMe: Model<IAboutMe> = model("Project", schema);
