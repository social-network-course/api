import moment from "moment";
import fetch from "node-fetch";

const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

const appendApiKey = (url) => {
    const API_KEY = process.env.MOVIEDB_API_KEY;

    return `${url}?api_key=${API_KEY}`;
};

export const fetchMoviesData = async () => {
    const movieDbUrl = process.env.MOVIEDB_URL;

    try {
        const response = await fetch(appendApiKey(`${movieDbUrl}/movie/popular`), {
                method: 'GET',
                headers: defaultHeaders
            }
        );

        return response.json();
    } catch (err) {
        console.error(err);
    }
}

export const storeData = async params => {
    const user = await User.findOneAndUpdate({ id: params.id }, () => {

    });

    await user.save();
}
