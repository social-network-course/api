import fetch from "node-fetch";
import * as requestIp from 'request-ip';
import pkg from 'geoip-lite';
const { lookup } = pkg;

import { logger } from "./logging.js";

export const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

export const appendApiKey = (url) => {
    const API_KEY = process.env.MOVIEDB_API_KEY;

    return `${url}?api_key=${API_KEY}`;
};

export const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    if (token) {
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`, {
            method: 'GET',
            headers: defaultHeaders
        });

        response.json().then((data) => {
            logger.log({
                level: 'info',
                message: data
            });
            if (data.error && data.error.code === 190) {
                res.status(401).send();
            } else {
                res.locals.user = data;
                return next();
            }
        });
    } else if (!token) {
        res.status(401).send();
    } else {
        return next();
    }
};

export const locationMiddleware = async (req, res, next) => {
    const clientIp = requestIp.getClientIp(req);
    // hardcoded for now because localhost can't get resolved
    const location = lookup(clientIp);

    res.locals.userLocation = location;
    return next();
};