export const appendApiKey = (url) => {
    const API_KEY = process.env.MOVIEDB_API_KEY;

    return `${url}?api_key=${API_KEY}`;
};

export const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

export const NUMBER_OF_PAGES = 11;