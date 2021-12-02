import moment from 'moment';

import User from '../model/user.model.js';
import Movie from '../model/movie.model.js';
import { fetchWeather } from "../client/user.client.js";
import { errorConstants } from "../util/error.js";

export const storeUser = async ({ id, name, email, url }, ipLocation) => {
    const user = await User.findOne({ id: id });

    if (user) {
        throw errorConstants.ALREADY_EXISTING_USER;
    } else {
        const user = new User({
            id: id,
            email: email,
            likes: [],
            location: ipLocation,
            name: name,
            pictureUrl: url,
            ratings: [],
            watchlist: [],
            timestamp: moment().utc().format()
        });

        await user.save();
    }
};

export const getUserData = async ({ name, id } ) => {
    const user = await User.findOne({ id: id });

    if (!user) {
        throw errorConstants.MISSING_USER;
    } else {
        const { ll } = user.location;
        const currentWeather = await fetchWeather(ll[0], ll[1]);

        return {
            id: user.id,
            email: user.email,
            likes: user.likes,
            location: user.location,
            name: user.name,
            pictureUrl: user.pictureUrl,
            ratings: user.ratings,
            watchlist: user.watchlist,
            weather: currentWeather
        };
    }
};

export const storeUserLike = async ({ id }, { movieId }) => {
    if (!id) {
        throw errorConstants.MISSING_USER_ID;
    } else if (!movieId) {
        throw errorConstants.MISSING_MOVIE_ID;
    } else {
        return new Promise((resolve, reject) => {
            User.findOneAndUpdate({ id: id }, { $addToSet: { likes: movieId } }, null, (error, doc) => {
                if (error) {
                    throw errorConstants.STORING_DATA_FAILED;
                } else {
                    resolve(movieId);
                }
            });
        });
    }
};

export const storeUserUnlike = async ({ id }, { movieId }) => {
    if (!id) {
        throw errorConstants.MISSING_USER_ID;
    } else if (!movieId) {
        throw errorConstants.MISSING_MOVIE_ID;
    } else {
        return new Promise((resolve, reject) => {
            User.findOneAndUpdate({ id: id }, { $pull: { likes: movieId } },null,  (error, doc) => {
                if (error) {
                    throw errorConstants.STORING_DATA_FAILED;
                } else {
                    return resolve(movieId);
                }
            });
        });
    }
};

export const addToUserWatchlist = async ({ id }, { movieId }) => {
    if (!id) {
        throw errorConstants.MISSING_USER_ID;
    } else if (!movieId) {
        throw errorConstants.MISSING_MOVIE_ID;
    } else {
        return new Promise((resolve, reject) => {
            User.findOneAndUpdate({ id: id }, { $addToSet: { watchlist: movieId } }, null, (error, doc) => {
                if (error) {
                    throw errorConstants.STORING_DATA_FAILED;
                } else {
                    resolve(movieId);
                }
            });
        });
    }
};

export const removeFromUserWatchlist = async ({ id }, { movieId }) => {
    if (!id) {
        throw errorConstants.MISSING_USER_ID;
    } else if (!movieId) {
        throw errorConstants.MISSING_MOVIE_ID;
    } else {
        return new Promise((resolve, reject) => {
            User.findOneAndUpdate({ id: id }, { $pull: { watchlist: movieId } }, null, (error, doc) => {
                if (error) {
                    throw errorConstants.STORING_DATA_FAILED;
                } else {
                    return resolve(movieId);
                }
            });
        });
    }
};

export const storeMovieRating = async ({ id }, body) => {
    const movieId = Object.keys(body)[0];
    const rating = body[movieId];

    if (!id) {
        throw errorConstants.MISSING_USER_ID;
    } else if (!movieId) {
        throw errorConstants.MISSING_MOVIE_ID;
    } else {
        return new Promise((resolve, reject) => {
            User.findOneAndUpdate({ id: id }, { $addToSet: { ratings: { [movieId.toString()]: rating } } }, null, (error, doc) => {
                if (error) {
                    throw errorConstants.STORING_DATA_FAILED;
                } else {
                    return resolve({
                        [movieId]: rating
                    });
                }
            });
        });
    }
};

export const storeMovieVisit = async ({ id }, body) => {
    const movieId = Object.keys(body)[0];
    const visitTime = body[movieId];

    if (!id) {
        throw errorConstants.MISSING_USER_ID;
    } else if (!movieId) {
        throw errorConstants.MISSING_MOVIE_ID;
    } else {
        return new Promise((resolve, reject) => {
            User.findOneAndUpdate({ id: id }, { $addToSet: { visit_time: { [movieId.toString()]: visitTime } } }, null, (error, doc) => {
                if (error) {
                    throw errorConstants.STORING_DATA_FAILED;
                }
            });

            Movie.findOneAndUpdate({ id: movieId }, { $inc: { visit_counter: 1 } }, null,(error, doc) => {
                if (error) {
                    throw errorConstants.STORING_DATA_FAILED;
                } else {
                    return resolve(movieId);
                }
            });
        });
    }
};
