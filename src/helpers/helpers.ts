import jwt from "express-jwt";
import { MongoService } from "../services/MongoService";
import Container from "typedi";

export function isNumber(string: string){
    return !isNaN(parseInt(string))
}

export const JWT_MIDDLEWARE = jwt({secret: process.env.JWT_SECRET, algorithms: ['HS256'], isRevoked: (req, payload, done) => {
    const mongo = Container.get(MongoService)

    const {authorization} = req.headers;

    const token = authorization.split('Bearer ')[1];

    const sig = token.split('.')[2];

   mongo.revokedToken.findOne({token: sig}).then((token) => {
    if(token){
        return done(null, true);
    }

    return done(null, false)

   }).catch((err) => done(err))

}})