import moment from "moment";

import Movie from "../model/movie.model.js";
import Genre from "../model/genre.model.js";
import {
    fetchRegionMovies,
    fetchMovieDetails,
    fetchPersonDetails
} from "../client/movie.client.js";

export const getGenres = async () => {
    const genres = await Genre
        .find({}, 'id name')
        .sort({ name: 'asc' })

    return genres;
};

export const getRecommendedMovies = async ({ page, limit }) => {
    const recommendedMovies = await Movie
        .find()
        .sort({ popularity: 'desc' })
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
    // first *limit* movies to feature on carousel on the front page
    const featuredMovies = await Movie
        .find({}, 'id title backdrop_path overview genre_ids vote_average')
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
        }, 'id title poster_path vote_average')
        .sort({ popularity: 'desc' })
        .limit(Number(limit));

    return moviesInTheaters;
};

export const getRegionMovies = async ({ limit }, ipLocation) => {
    const regionMovies = await fetchRegionMovies(ipLocation.country);

    return {
        ...regionMovies,
        country: ipLocation.country
    };
};

export const getTopRevenueMovies = async ({ limit }) => {
    const topRevenueMovies = await Movie
        .find({}, 'id title revenue')
        .sort({ revenue: 'desc' })
        .limit(Number(limit));

    return topRevenueMovies;
};

export const getMostVisitedMovies = async ({ limit }) => {
    const mostVisitedMovies = await Movie
        .find({ visit_counter: { $gt: 0 } }, 'id title backdrop_path visit_counter')
        .sort({ visit_counter: 'desc' })
        .limit(Number(limit));

    return mostVisitedMovies;
};

export const getMovieDetails = async ({ id }) => {
    const details = await Movie.findOne({ id });

    if (!details) {
        const apiDetails = await fetchMovieDetails(id);
        return apiDetails;
    }

    return details;
};

export const getPersonDetails = async ({ id }) => {
    const details = await fetchPersonDetails(id);

    return details;
};

