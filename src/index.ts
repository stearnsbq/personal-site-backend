import "reflect-metadata";
import App from "./app";
import { json } from "body-parser";
import mongoose from 'mongoose'; 

const app = new App(__dirname + "/controllers", [json()], 8080);

app.listen(async () => {

  await mongoose.connect(process.env.MONGO_URL);

  console.log(`Listening on ${app.port}`);
});
