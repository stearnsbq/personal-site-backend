import { modelOptions, prop } from "@typegoose/typegoose";

export class CertsAndLicenses {
  @prop()
  title: string;

  @prop()
  credential?: string;

  @prop()
  description: string;

  @prop()
  acquired: Date;

  @prop()
  expiration?: Date;
}

export class Experience {
  @prop()
  public title: string;

  @prop()
  public company: string;

  @prop()
  public start: Date;

  @prop()
  public end?: Date;

  @prop({ type: () => [String] })
  public bullets: string[];
}

export class Education {
  @prop()
  public degree: string;

  @prop()
  public school: string;

  @prop()
  public start: Date;

  @prop()
  public end?: Date;
}

@modelOptions({ schemaOptions: { capped: { max: 1 } } })
export class AboutMe {
  @prop()
  public _id: string;

  @prop({ required: true })
  public about: string;

  @prop({ type: () => [Education] })
  public education: Education[];

  @prop({ type: () => [Experience] })
  public experience: Experience[];

  @prop({ type: () => [CertsAndLicenses] })
  public certsAndLicenses: CertsAndLicenses[];
}
