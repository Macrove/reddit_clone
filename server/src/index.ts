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
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

const main = async () => {

    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();

    // switch based on npm script executed (testing vs prod)
    // const origin = (process.env.NODE_ENV === 'PLAYGROUND')
    //     ? process.env.PLAYGROUND_OG
    //     : process.env.CLIENT_ORIGIN;

    // const corsOptions = {
    //     origin: origin,
    //     credentials: true,
    // }

    // other config


    // app.use(cors({
    //     origin: ["https://studio.apollographql.com", "http://localhost:3000"],
    //     credentials: true
    // })
    // )





    const RedisStore = connectRedis(session)
    const redisClient = redis.createClient()

    app.use(
        session({
            name: "qid",
            store: new RedisStore({
                client: redisClient,
                disableTouch: true
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
                secure: __prod__,
                sameSite: 'lax',
                httpOnly: true,
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
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground
        ],
        context: ({ req, res }): MyContext => ({ em: orm.em, req, res })
    });
    await apolloServer.start();

    apolloServer.applyMiddleware({
        app, cors: {
            origin: "http://localhost:3000",
            credentials: true
        }
    });

    app.listen(4000, () => {
        console.log('PORT 4000 ACTIVE NOW!!')
    });

};

main().catch(err => {
    console.log(err);
})