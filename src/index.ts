import "reflect-metadata";
import App from "./app";
import { json } from "body-parser";
import mongoose from 'mongoose'; 
require('dotenv').config()


async function main(){

  try{
    const app = new App(__dirname + "/controllers", [json()], 8080);

    await mongoose.connect(process.env.MONGO_URL);
  
    app.listen(async () => {
      console.log(`Listening on ${app.port}`);
    });
  }catch(err){
    console.log("FAILED TO START APPLICATION", err)
  }


}


main();