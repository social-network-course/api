import fetch from "node-fetch";
import moment from "moment";

import TopRated from '../model/topRatedMovie.model.js';
import RecommendedMovie from '../model/recommendedMovie.model.js';
import { appendApiKey, defaultHeaders } from "../util/communication.js";

export const fetchRecommendedMoviesData = async () => {
    const movieDbUrl = process.env.MOVIEDB_URL;

    try {
        const response = await fetch(appendApiKey(`${movieDbUrl}/movie/popular`), {
                method: 'GET',
                headers: defaultHeaders
            }
        );

        response.json().then(async (data) => {
            await RecommendedMovie.deleteMany({});

            data.results.map(async (movie) => {
                const recommendedMovie = new RecommendedMovie({
                    ...movie,
                    timestamp: moment().add(2, 'hours').format()
                });

                await recommendedMovie.save();
            });
        });
    } catch (err) {
        console.error(err);
    }
};

export const fetchTopRatedMoviesData = async () => {
    const movieDbUrl = process.env.MOVIEDB_URL;

    try {
        const response = await fetch(appendApiKey(`${movieDbUrl}/movie/top_rated`), {
                method: 'GET',
                headers: defaultHeaders
            }
        );

        response.json().then(async (data) => {
            await TopRated.deleteMany({});

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
};
