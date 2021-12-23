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
import jwt from "jsonwebtoken";
import { GithubService } from "./services/GithubService";
import multer from "multer";

async function main() {
  try {
    config();

    const app = new App(__dirname + "/controllers", [json(), helmet(), cors({origin: "*"}), morgan('common')], 8080);


    const mongo = Container.get(MongoService);
    const git = Container.get(GithubService)

    
    await mongo.connect(process.env.MONGO_URL)

    console.log(jwt.sign(
      { username: "quinn50" },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    ))

    app.listen(async () => {
      console.log(`Listening on ${app.port}`);
    });

  } catch (err) {
    console.log("FAILED TO START APPLICATION", err);
  }
}

main();
