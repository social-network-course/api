import fetch from "node-fetch";

import RecommendedMovie from "../model/recommendedMovie.model.js";
import TopRatedMovie from "../model/topRatedMovie.model.js";
import { appendApiKey, defaultHeaders } from "../util/communication.js";

export const getMovieDetails = async (params) => {
    const movieDetails = await fetchMovieDetails(params.id);
    const movieCast = await fetchMovieCast(params.id);
    const fullDetails = Object.assign({}, movieDetails, movieCast);

    return fullDetails;
};

export const getRecommendedMovies = async () => {
    const recommendedMovies = await RecommendedMovie.find({});

    return recommendedMovies;
};

export const getTopRatedMovies = async (params) => {
    const topRatedMovies = await TopRatedMovie.find({});

    return topRatedMovies;
};

const fetchMovieDetails = async (id) => {
    const movieDbUrl = process.env.MOVIEDB_URL;

    try {
        const response = await fetch(appendApiKey(`${movieDbUrl}/movie/${id}`), {
                method: 'GET',
                headers: defaultHeaders
            }
        );

        return response.json();
    } catch (err) {
        console.error(err);
    }
};

const fetchMovieCast = async (id) => {
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