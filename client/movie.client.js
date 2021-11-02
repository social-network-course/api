import fetch from "node-fetch";
import moment from "moment";

import TopRated from '../model/topRatedMovie.model.js';
import RecommendedMovie from '../model/recommendedMovie.model.js';
import { appendApiKey, defaultHeaders, NUMBER_OF_PAGES } from "../util/communication.js";

export const fetchRecommendedMoviesData = async () => {
    const movieDbUrl = process.env.MOVIEDB_URL;

    await RecommendedMovie.deleteMany({});

    for (let i = 1; i <= NUMBER_OF_PAGES; i++) {
        try {
            const response = await fetch(appendApiKey(`${movieDbUrl}/movie/popular`).concat(`&page=${i}`), {
                    method: 'GET',
                    headers: defaultHeaders
                }
            );

            response.json().then(async (data) => {
                data.results.map(async (movie) => {
                    const recommendedMovie = new RecommendedMovie({
                        ...movie,
                        timestamp: moment().add(2, 'hours').format()
                    });

                    await recommendedMovie.save();
                });
            });
        } catch (err) {
        }
    }
};

export const fetchTopRatedMoviesData = async () => {
    const movieDbUrl = process.env.MOVIEDB_URL;

    await TopRated.deleteMany({});

    for (let i = 1; i <= NUMBER_OF_PAGES; i++) {
        try {
            const response = await fetch(appendApiKey(`${movieDbUrl}/movie/top_rated`).concat(`&page=${i}`), {
                    method: 'GET',
                    headers: defaultHeaders
                }
            );

            response.json().then(async (data) => {
                data.results.map(async (movie) => {
                    const topRated = new TopRated({
                        ...movie,
                        timestamp: moment().add(2, 'hours').format()
                    });

                    await topRated.save();
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
