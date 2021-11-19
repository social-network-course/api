import fetch from "node-fetch";
import moment from "moment";

import Movie from '../model/movie.model.js';
import { appendApiKey, defaultHeaders } from "../util/communication.js";

const NUMBER_OF_PAGES = 50;

export const fetchMovies = async () => {
    const movieDbUrl = process.env.MOVIEDB_URL;

    await Movie.deleteMany({});

    for (let i = 1; i <= NUMBER_OF_PAGES; i++) {
        try {
            const response = await fetch(appendApiKey(`${movieDbUrl}/movie/popular`).concat(`&page=${i}`), {
                    method: 'GET',
                    headers: defaultHeaders
                }
            );

            response.json().then(async (data) => {
                data.results.map(async (movieObj) => {
                    const movie = new Movie({
                        ...movieObj,
                        timestamp: moment().add(2, 'hours').format()
                    });

                    await movie.save();
                });
            });
        } catch (err) {
            console.error(err);
        }
    }
};

export const fetchMovieDetails = async (id) => {
    const movieDbUrl = process.env.MOVIEDB_URL;

    try {
        const response = await fetch(appendApiKey(`${movieDbUrl}/movie/${id}`).concat('&append_to_response=videos'), {
                method: 'GET',
                headers: defaultHeaders
            }
        );

        return response.json();
    } catch (err) {
        console.error(err);
    }
};

export const fetchMovieCast = async (id) => {
    const movieDbUrl = process.env.MOVIEDB_URL;

    try {
        const response = await fetch(appendApiKey(`${movieDbUrl}/movie/${id}/credits`), {
                method: 'GET',
                headers: defaultHeaders
            }
        );

        return response.json();
    } catch (err) {
        console.error(err);
    }
};

export const fetchRegionMovies = async (region, limit) => {
    const movieDbUrl = process.env.MOVIEDB_URL;

    try {
        const response = await fetch(appendApiKey(`${movieDbUrl}/movie/popular`).concat(`&region=${region.toUpperCase()}`), {
                method: 'GET',
                headers: defaultHeaders
            }
        );

        return response.json();
    } catch (err) {
        console.error(err);
    }
};

export const fetchLatestMovie = async () => {
    const movieDbUrl = process.env.MOVIEDB_URL;

    try {
        const response = await fetch(appendApiKey(`${movieDbUrl}/movie/latest`), {
                method: 'GET',
                headers: defaultHeaders
            }
        );

        return response.json();
    } catch (err) {
        console.error(err);
    }
};
