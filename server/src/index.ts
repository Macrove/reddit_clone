import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from './constants';
// import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";
import { ApolloServer } from 'apollo-server-express';
import express from "express";
import { HelloResolver } from './resolvers/hello';
import { PostsResolver } from "./resolvers/posts";
import { UserResolver } from './resolvers/user';
import { buildSchema } from 'type-graphql';
import connectRedis from 'connect-redis';
import redis from 'redis';
import session from 'express-session';
import { MyContext } from 'src/types';
import cors from 'cors'

const main = async () => {

    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();

    let RedisStore = connectRedis(session)
    let redisClient = redis.createClient()
    redisClient.on("error", err => {
        console.log(err)
    })
    app.use(cors({
        origin: ["https://studio.apollographql.com", "http://localhost:3000"],
        credentials: true
    }
    ))
    app.use(
        session({
            name: 'qid',
            store: new RedisStore({
                client: redisClient,
                disableTouch: true
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365,
                httpOnly: true,
                secure: true,
                sameSite: "none",

            },
            saveUninitialized: false,
            secret: 'iuefiubfaeiubreiupbrvpueivbfiuebv',
            resave: false,
        })
    )
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostsResolver, UserResolver],
            validate: false
        }),
        context: ({ req, res }): MyContext => ({ em: orm.em, req, res })
    });
    await apolloServer.start();

    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(4000, () => {
        console.log('PORT 4000 ACTIVE NOW!!')
    });

};

main().catch(err => {
    console.log(err);
})