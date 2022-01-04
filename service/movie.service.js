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
    const user = await User.findOne({ id: id });
    const otherUsers = await User.find({ id: { $ne: id } });
    let pearsonCoefficients = [];

    const normalizedActiveUserRatings = normalizeUserRatings(user.genre_ratings.ratings, user.genre_ratings.avgRatingAggregate.avgRating);

    otherUsers.forEach((otherUser) => {
        const normalizedOtherUserRatings = normalizeUserRatings(otherUser.genre_ratings.ratings, otherUser.genre_ratings.avgRatingAggregate.avgRating)
        const pearsonCorrelation = getPearsonCorrelation(normalizedActiveUserRatings, normalizedOtherUserRatings);
        pearsonCoefficients.push({ [otherUser.id]: pearsonCorrelation });
    });

    pearsonCoefficients.sort(sortByField('pearsonCorrelation'));
    const topLookupUsers = pearsonCoefficients.slice(0, RECOMMENDER_NO_OF_LOOKUP_USERS + 1);

    let movies = [];
    for (let i = 0; i < topLookupUsers.length; i++) {
        const user = otherUsers.find((user) => user.id === Number(Object.keys(topLookupUsers[i])[0]));
        const topLookupUsersRatings = user.ratings.slice(0, RECOMMENDER_NO_OF_LOOKUP_USERS_RATINGS + 1);
        for (const rating of topLookupUsersRatings) {
            const movie = await Movie.findOne({ id: rating.movieId });
            if (movie) {
                movies.push(movie);
            }
        }
    }

    return {
        movies: movies,
        pages: Math.ceil(movies.length / limit)
    };
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
        if (rating.totalNumberOfRatings > 0) {
            return rating.avgRating - userAvgRatingAggregate;
        } else {
            return null;
        }
    });

    return normalizedUserRatings;
};

const getPearsonCorrelation = (normalizedActiveUserRatings, normalizedOtherUserRatings) => {
    let pearsonNumerator = 0;
    let pearsonDenominatorActiveUser = 0;
    let pearsonDenominatorOtherUser = 0;

    for (let i = 0; i < normalizedActiveUserRatings.length; i++) {
        if (!normalizedActiveUserRatings[i] || !normalizedOtherUserRatings[i]) {
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