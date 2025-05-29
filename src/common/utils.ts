import {Request} from 'express'
export interface ExtendedReq extends Request {
    token?: string | null;
    userId?: string | null;
    ownerId?: string | null;
}