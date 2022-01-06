import moment from "moment";

import Movie from "../model/movie.model.js";
import Genre from "../model/genre.model.js";
import Status from "../model/status.model.js";
import User from "../model/user.model.js";
import {
    fetchRegionMovies,
    fetchMovieDetails,
    fetchPersonDetails
} from "../client/movie.client.js";
import { sortByField } from "../util/general.js";
import { RECOMMENDER_NO_OF_LOOKUP_USERS, RECOMMENDER_NO_OF_LOOKUP_USERS_RATINGS } from "../util/constants.js";

export const getGenres = async () => {
    const genres = await Genre
        .find({}, 'id name')
        .sort({ name: 'asc' })

    return genres;
};

export const getStatuses = async () => {
    const statuses = await Status
        .find({}, 'id name')
        .sort({ name: 'asc' })

    return statuses;
};

export const getTopRatedMovies = async ({ page, limit, genre, status }) => {
    const query = addFilterQuery(genre, status);

    const movies = await buildAggregation(query, { vote_average: -1, title: 1 }, limit, page);

    return {
        movies: movies[0].data,
        pages: movies[0].info.length > 0 ? Math.ceil(Number(movies[0].info[0].total) / limit) : movies[0].info
    };
};

export const getPopularMovies = async ({ page, limit, genre, status }) => {
    const query = addFilterQuery(genre, status);

    const movies = await buildAggregation(query, { popularity: -1, title: 1 }, limit, page);

    return {
        movies: movies[0].data,
        pages: movies[0].info.length > 0 ? Math.ceil(Number(movies[0].info[0].total) / limit) : movies[0].info
    };
};

export const getRecommendedMovies = async (id, { page, limit = 22, genre, status }) => {
    const activeUser = await User.findOne({ id: id });
    const otherUsers = await User.find({ id: { $ne: id } });

    if (activeUser.ratings.length > 0) {
        let pearsonCoefficients = [];

        const normalizedActiveUserRatings = normalizeUserRatings(activeUser.genre_ratings.ratings, activeUser.genre_ratings.avgRatingAggregate.avgRating);

        otherUsers.forEach((otherUser) => {
            if (otherUser.ratings.length > 0) {
                const normalizedOtherUserRatings = normalizeUserRatings(otherUser.genre_ratings.ratings, otherUser.genre_ratings.avgRatingAggregate.avgRating)
                const pearsonCorrelation = getPearsonCorrelation(normalizedActiveUserRatings, normalizedOtherUserRatings);
                pearsonCoefficients.push({
                    userId: otherUser.id,
                    similarity: pearsonCorrelation
                });
            }
        });

        pearsonCoefficients.sort(sortByField('similarity')).reverse();
        const topLookupUsers = pearsonCoefficients.slice(0, RECOMMENDER_NO_OF_LOOKUP_USERS);
        let movies = [];
        for (const topLookupUser of topLookupUsers) {
            const user = otherUsers.find((user) => user.id === Number(topLookupUser.userId));
            const topLookupUserRatings = user.ratings.slice(0, RECOMMENDER_NO_OF_LOOKUP_USERS_RATINGS);
            for (const rating of topLookupUserRatings) {
                if (!activeUser.ratings.find((activeUserRating) => activeUserRating.movieId === rating.movieId)) {
                    const movie = await Movie.findOne({ id: rating.movieId });
                    // movie check because movie can be from region list, which is not queried from db
                    if (movie && !movies.find((recommendedMovie) => recommendedMovie.id === movie.id)) {
                        movies.push(movie);
                    }
                }
            }
        }

        return {
            movies: movies,
            pages: Math.ceil(movies.length / limit)
        };
    } else {
        return {
            movies: null,
            pages: null
        }
    }
};

export const getFeaturedMovies = async ({ limit }) => {
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

const addFilterQuery = (genre, status) => {
    const genreFilters = genre.split(',');
    const statusFilters = status.split(',');

    let query = {};

    if (genre) {
        query['genres.name'] = { $in: genreFilters };
    }

    // a movie can be in only one status
    if (status) {
        query['status'] = { $in: statusFilters };
    }

    return query;
};

const buildAggregation = async (query, sort, limit, page) => {
    const movies = await Movie.aggregate([
        { $match: query },
        { $facet: {
                data: [
                    { $sort: sort },
                    { $skip: limit * (Number(page) - 1) },
                    { $limit: Number(limit) }
                ],
                info: [
                    { $count: 'total' }
                ]
            }}
    ]);

     return movies;
};

const normalizeUserRatings = (userGenreRatings, userAvgRatingAggregate) => {
    const normalizedUserRatings = userGenreRatings.map((rating) => {
        if (rating.totalNumberOfRatings === 0) {
            return null;
        }

        return rating.avgRating - userAvgRatingAggregate;
    });

    return normalizedUserRatings;
};

const getPearsonCorrelation = (normalizedActiveUserRatings, normalizedOtherUserRatings) => {
    let pearsonNumerator = 0;
    let pearsonDenominatorActiveUser = 0;
    let pearsonDenominatorOtherUser = 0;

    for (let i = 0; i < normalizedActiveUserRatings.length; i++) {
        if (normalizedActiveUserRatings[i] === null || normalizedOtherUserRatings[i] === null) {
            continue;
        } else {
            pearsonNumerator += normalizedActiveUserRatings[i] * normalizedOtherUserRatings[i];
            pearsonDenominatorActiveUser += Math.pow(normalizedActiveUserRatings[i], 2);
            pearsonDenominatorOtherUser += Math.pow(normalizedOtherUserRatings[i], 2);
        }
    }

    const pearsonDenominator = Math.sqrt(pearsonDenominatorActiveUser * pearsonDenominatorOtherUser);

    return pearsonDenominator === 0 ? 0 : pearsonNumerator / pearsonDenominator;
};