import { EntityManager, Connection, IDatabaseDriver } from "@mikro-orm/core";
import { Request, Response } from 'express';

declare module 'express-session' {
    interface Session {
        userId: number;
    }
}
export type MyContext = {
    em: EntityManager<IDatabaseDriver<Connection>>
    req: Request //& {session : session.Session & Partial<session.SessionData> & {userId : number}}
    res: Response
}