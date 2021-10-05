import "reflect-metadata";
import App from "./app";
import { json } from "body-parser";

const app = new App(__dirname + "/controllers", [json()], 8080);

app.listen(() => {
  console.log(`Listening on ${app.port}`);
});
