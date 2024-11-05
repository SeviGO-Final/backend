import session from "express-session";
import {Request} from "express";

interface SessionData extends session.Session {
    user?: any;
}

export interface CustomRequest extends Request {
    session: SessionData;
}