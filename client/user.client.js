import fetch from "node-fetch";

import { defaultHeaders } from "../util/communication.js";

export const fetchWeather = async (lat, lon) => {
    const owmUrl = process.env.OWM_URL;
    const owmApiKey = process.env.OWM_API_KEY;

    try {
        const response = await fetch(`${owmUrl}/weather?lat=${lat}&lon=${lon}&appid=${owmApiKey}&units=metric`, {
            method: 'GET',
            headers: defaultHeaders
        });

        return response.json();
    } catch (err) {
        console.error(err);
    }
};