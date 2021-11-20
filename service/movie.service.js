import moment from "moment";

import Movie from "../model/movie.model.js";
import {
    fetchLatestMovie,
    fetchMovieCast,
    fetchMovieDetails,
    fetchRegionMovies
} from "../client/movie.client.js";

export const getMovieDetails = async ({ id }) => {
    const movieDetails = await fetchMovieDetails(id);
    const movieCast = await fetchMovieCast(id);
    const fullDetails = Object.assign({}, movieDetails, movieCast);

    return fullDetails;
};

export const getRecommendedMovies = async ({ page, limit }) => {
    const recommendedMovies = await Movie
        .find()
        .skip(limit * (Number(page) - 1))
        .limit(Number(limit));

    return recommendedMovies;
};

export const getTopRatedMovies = async ({ page, limit }) => {
    const topRatedMovies = await Movie
        .find()
        .sort({ vote_average: 'desc' })
        .skip(limit * (Number(page) - 1))
        .limit(Number(limit));

    return topRatedMovies;
};

export const getPopularMovies = async ({ page, limit }) => {
    const popularMovies = await Movie
        .find()
        .sort({ popularity: 'desc' })
        .skip(limit * (Number(page) - 1))
        .limit(Number(limit));

    return popularMovies;
};


export const getFeaturedMovies = async ({ limit }) => {
    const featuredMovies = await Movie
        .find()
        .sort({ popularity: 'desc' })
        .limit(Number(limit));

    return featuredMovies;
};

export const getMoviesInTheaters = async ({ limit }) => {
    const today = new Date();
    const interval = 14;
    const todayMinusInterval = new Date(new Date(today).setDate(today.getDate() - interval));

    const moviesInTheaters = await Movie
        .find({
            release_date: {
                $gte: moment(todayMinusInterval).format('YYYY-MM-DD'),
                $lt: moment(today).format('YYYY-MM-DD')
            }
        })
        .sort({ popularity: 'desc' })
        .limit(Number(limit));

    return moviesInTheaters;
};

export const getRegionMovies = async ({ region, limit }, ipLocation) => {
    const regionMovies = await fetchRegionMovies(ipLocation.country);

    return {
        ...regionMovies,
        country: ipLocation.country
    };
};

export const getLatestMovie = async () => {
    const latestMovie = await fetchLatestMovie();

    return latestMovie;
};