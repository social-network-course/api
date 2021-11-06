import fetch from "node-fetch";

export const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

export const NUMBER_OF_PAGES = 11;

export const appendApiKey = (url) => {
    const API_KEY = process.env.MOVIEDB_API_KEY;

    return `${url}?api_key=${API_KEY}`;
};

export const checkFbTokenExpiration = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
console.log(token)
    if (token) {
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`, {
            method: 'GET',
            headers: defaultHeaders
        });

        response.json().then((data) => {console.log(data)
            if (data.error && data.error.code === 190) {
                res.status(401).send();
            } else {
                next();
            }
        });
    } else {
        res.status(401).send();
    }
};