import fetch from "node-fetch";

import { logger } from "./logging.js";

export const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

export const NUMBER_OF_PAGES = 50;

export const appendApiKey = (url) => {
    const API_KEY = process.env.MOVIEDB_API_KEY;

    return `${url}?api_key=${API_KEY}`;
};

export const checkFbTokenExpiration = async (req, res, next) => {
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
    } else {
        res.status(401).send();
    }
};