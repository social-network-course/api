import RecommendedMovie from "../model/recommendedMovie.model.js";
import TopRatedMovie from "../model/topRatedMovie.model.js";
import PopularMovie from "../model/popularMovie.model.js";
import { fetchMovieCast, fetchMovieDetails } from "../client/movie.client.js";

export const getMovieDetails = async (params) => {
    const movieDetails = await fetchMovieDetails(params.id);
    const movieCast = await fetchMovieCast(params.id);
    const fullDetails = Object.assign({}, movieDetails, movieCast);

    return fullDetails;
};

export const getRecommendedMovies = async ({ page, limit }) => {
    const recommendedMovies = await RecommendedMovie
        .find()
        .skip(limit * (Number(page) - 1))
        .limit(Number(limit));

    return recommendedMovies;
};

export const getTopRatedMovies = async ({ page, limit }) => {
    const topRatedMovies = await TopRatedMovie
        .find()
        .skip(limit * (Number(page) - 1))
        .limit(Number(limit));

    return topRatedMovies;
};

export const getPopularMovies = async ({ page, limit }) => {
    const popularMovies = await PopularMovie
        .find()
        .skip(limit * (Number(page) - 1))
        .limit(Number(limit));

    return popularMovies;
};


export const getFeaturedMovies = async ({ limit }) => {
    const featuredMovies = await PopularMovie
        .find()
        .sort({ popularity: 'desc' })
        .limit(Number(limit));

    return featuredMovies;
};