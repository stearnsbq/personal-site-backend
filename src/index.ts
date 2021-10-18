import "reflect-metadata";
import App from "./app";
import { json } from "body-parser";
import helmet from 'helmet';
import mongoose from "mongoose";
import cors from 'cors';
import morgan from 'morgan'
import {config} from 'dotenv'
import Container from "typedi";
import { MongoService } from "./services/MongoService";

async function main() {
  try {
    config();
    const app = new App(__dirname + "/controllers", [json(), helmet(), cors({origin: "*"}), morgan('common')], 8080);

    const mongo = Container.get(MongoService);

    await mongo.connect(process.env.MONGO_URL)

    app.listen(async () => {
      console.log(`Listening on ${app.port}`);
    });

  } catch (err) {
    console.log("FAILED TO START APPLICATION", err);
  }
}

main();
