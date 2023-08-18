// eslint-disable-next-line @typescript-eslint/no-unused-vars
import express from 'express';
import { DecodedUserPayload } from '../user';

declare global {
    namespace Express {
        interface Request {
            user: DecodedUserPayload;
            subscriptionDetails?: { [addonCode: string]: number };
            limiter: {
                limit: number;
                current: number;
                remaining: number;
                resetTime: Date;
            };
        }
        interface Response {
            user: DecodedUserPayload;
            subscriptionDetails?: { [addonCode: string]: number };
            limiter: {
                limit: number;
                current: number;
                remaining: number;
                resetTime: Date;
            };
        }
    }
}
