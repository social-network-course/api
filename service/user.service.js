import User from '../model/user.model.js';
import Movie from '../model/movie.model.js';
import { fetchWeather } from "../client/user.client.js";
import { errorConstants } from "../util/error.js";
import { sortByField } from "../util/general.js";

export const storeUser = async ({ id, name, email, url }, ipLocation) => {
    const user = await User.findOne({ id: id });

    if (user) {
        throw errorConstants.ALREADY_EXISTING_USER;
    } else {
        const user = new User({
            id: id,
            email: email,
            location: ipLocation,
            name: name,
            pictureUrl: url
        });

        await user.save();
    }
};

export const getUserData = async ({ name, id } ) => {
    const user = await User.findOne({ id: id });

    if (!user) {
        throw errorConstants.MISSING_USER;
    } else {
        let currentWeather;
        if (user.location) {
            const { ll } = user.location;
            currentWeather = await fetchWeather(ll[0], ll[1]);
        }

        return {
            id: user.id,
            email: user.email,
            likes: user.likes,
            location: user.location,
            name: user.name,
            pictureUrl: user.pictureUrl,
            favourite_genres: user.favourite_genres,
            ratings: user.ratings,
            watchlist: user.watchlist,
            weather: currentWeather
        };
    }
};

export const addToFavouriteGenres = async ({ id }, { genreId }) => {
    if (!id) {
        throw errorConstants.MISSING_USER_ID;
    } else if (!genreId) {
        throw errorConstants.MISSING_GENRE_ID;
    } else {
        return new Promise((resolve, reject) => {
            User.updateOne({ id: id }, { $addToSet: { favourite_genres: genreId } }, null, (error, doc) => {
                if (error) {
                    throw errorConstants.STORING_DATA_FAILED;
                } else {
                    resolve(genreId.toString());
                }
            });
        });
    }
};

export const removeFromFavouriteGenres = async ({ id }, { genreId }) => {
    if (!id) {
        throw errorConstants.MISSING_USER_ID;
    } else if (!genreId) {
        throw errorConstants.MISSING_GENRE_ID;
    } else {
        return new Promise((resolve, reject) => {
            User.updateOne({ id: id }, { $pull: { favourite_genres: genreId } }, null, (error, doc) => {
                if (error) {
                    throw errorConstants.STORING_DATA_FAILED;
                } else {
                    return resolve(genreId.toString());
                }
            });
        });
    }
};

export const addToLikedList = async ({ id }, { movieId }) => {
    if (!id) {
        throw errorConstants.MISSING_USER_ID;
    } else if (!movieId) {
        throw errorConstants.MISSING_MOVIE_ID;
    } else {
        return new Promise((resolve, reject) => {
            User.updateOne({ id: id }, { $addToSet: { likes: movieId } }, null, (error, doc) => {
                if (error) {
                    throw errorConstants.STORING_DATA_FAILED;
                } else {
                    resolve(movieId.toString());
                }
            });
        });
    }
};

export const removeFromLikedList = async ({ id }, { movieId }) => {
    if (!id) {
        throw errorConstants.MISSING_USER_ID;
    } else if (!movieId) {
        throw errorConstants.MISSING_MOVIE_ID;
    } else {
        return new Promise((resolve, reject) => {
            User.updateOne({ id: id }, { $pull: { likes: movieId } },null,  (error, doc) => {
                if (error) {
                    throw errorConstants.STORING_DATA_FAILED;
                } else {
                    return resolve(movieId.toString());
                }
            });
        });
    }
};

export const addToWatchlist = async ({ id }, { movieId }) => {
    if (!id) {
        throw errorConstants.MISSING_USER_ID;
    } else if (!movieId) {
        throw errorConstants.MISSING_MOVIE_ID;
    } else {
        return new Promise((resolve, reject) => {
            User.updateOne({ id: id }, { $addToSet: { watchlist: movieId } }, null, (error, doc) => {
                if (error) {
                    throw errorConstants.STORING_DATA_FAILED;
                } else {
                    resolve(movieId.toString());
                }
            });
        });
    }
};

export const removeFromWatchlist = async ({ id }, { movieId }) => {
    if (!id) {
        throw errorConstants.MISSING_USER_ID;
    } else if (!movieId) {
        throw errorConstants.MISSING_MOVIE_ID;
    } else {
        return new Promise((resolve, reject) => {
            User.updateOne({ id: id }, { $pull: { watchlist: movieId } }, null, (error, doc) => {
                if (error) {
                    throw errorConstants.STORING_DATA_FAILED;
                } else {
                    return resolve(movieId.toString());
                }
            });
        });
    }
};

export const storeMovieRating = async ({ id }, body) => {
    const movieId = Number(body['movieId']);
    const rating = body['rating'];
    const genres = body['genres'];

     if (!id) {
        throw errorConstants.MISSING_USER_ID;
    } else if (!movieId) {
        throw errorConstants.MISSING_MOVIE_ID;
    } else {
        return new Promise(async (resolve, reject) => {
            const user = await User.findOne({ id: id });
            const { ratings, genre_ratings } = user;
            const userRating = ratings.find((rating) => rating.movieId === movieId);

            if (userRating) {
                userRating.rating = rating;
                userRating.genres = genres;
            } else {
                ratings.push({
                    movieId: movieId,
                    rating: rating,
                    genres: genres
                });
            }
            ratings.sort(sortByField('rating')).reverse();

            genres.forEach((genreId) => {
                const genre = genre_ratings.ratings.find((genre) => genre.genreId === genreId);

                if (userRating && genre.totalNumberOfRatings > 1) {
                    genre_ratings.avgRatingAggregate.totalNumberOfRatings--;
                    genre_ratings.avgRatingAggregate.sumOfRatings -= genre.avgRating;
                    genre_ratings.avgRatingAggregate.avgRating = genre_ratings.avgRatingAggregate.sumOfRatings / genre_ratings.avgRatingAggregate.totalNumberOfRatings;

                    genre.totalNumberOfRatings--;
                    genre.sumOfRatings -= userRating.rating;
                    genre.avgRating = genre.sumOfRatings / genre.totalNumberOfRatings;
                } else if (userRating && genre.totalNumberOfRatings === 1) {
                    genre_ratings.avgRatingAggregate.totalNumberOfRatings--;
                    genre_ratings.avgRatingAggregate.sumOfRatings -= genre.avgRating;
                    genre_ratings.avgRatingAggregate.avgRating = genre_ratings.avgRatingAggregate.sumOfRatings / genre_ratings.avgRatingAggregate.totalNumberOfRatings;

                    genre.totalNumberOfRatings = 0;
                    genre.sumOfRatings = 0;
                    genre.avgRating = 0;
                }

                genre.totalNumberOfRatings++;
                genre.sumOfRatings += rating;
                genre.avgRating = genre.sumOfRatings / genre.totalNumberOfRatings;

                genre_ratings.avgRatingAggregate.totalNumberOfRatings++;
                genre_ratings.avgRatingAggregate.sumOfRatings += genre.avgRating;
                genre_ratings.avgRatingAggregate.avgRating = genre_ratings.avgRatingAggregate.sumOfRatings / genre_ratings.avgRatingAggregate.totalNumberOfRatings;
            });

            user.markModified('ratings');
            user.markModified('genre_ratings');
            await user.save();

            return resolve({
                movieId: movieId,
                rating: rating,
                genres: genres
            });
        });
    }
};

export const storeMovieVisit = async ({ id }, { movieId, time }) => {
    if (!id) {
        throw errorConstants.MISSING_USER_ID;
    } else if (!movieId) {
        throw errorConstants.MISSING_MOVIE_ID;
    } else {
        return new Promise((resolve, reject) => {
            User.updateOne(
                { id: id },
                [{
                    $set: {
                        visit_times: {
                            $cond: [
                                { $in: [movieId, '$visit_times.movieId'] },
                                {
                                    $map: {
                                        input: '$visit_times',
                                        in: {
                                            $cond: [
                                                { $eq: ['$$this.movieId', movieId] },
                                                {
                                                    movieId: "$$this.movieId",
                                                    time: { $add: ['$$this.time', time] }
                                                },
                                                '$$this'
                                            ]
                                        }
                                    }
                                },
                                { $concatArrays: ['$visit_times', [{ movieId: movieId, time: time }]] }
                            ]
                        }
                    }
                }],
                null,
                (error, document) => {
                    if (error) {console.log(error)
                        throw errorConstants.STORING_DATA_FAILED;
                    }
                }
            );

            Movie.findOneAndUpdate({ id: movieId }, { $inc: { visit_counter: 1 } }, null,(error, doc) => {
                if (error) {
                    throw errorConstants.STORING_DATA_FAILED;
                } else {
                    return resolve({
                        movieId: movieId,
                        time: time
                    });
                }
            });
        });
    }
};
