import "reflect-metadata";
import App from "./app";
import { json } from "body-parser";
import Container from "typedi";
import { MongoService } from "./services/MongoService";
import { AboutMe } from "./model/AboutMe";
import { Project } from "./model/Project";

const app = new App(__dirname + "/controllers", [json()], 8080);

app.listen(async () => {

  const mongoService = Container.get(MongoService);

  await mongoService.connect("mongodb://192.168.1.247:27017/personal")

  console.log(`Listening on ${app.port}`);
});
