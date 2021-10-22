import moment from 'moment';

import User from '../model/user.model.js';
import { fetchRecommendedMoviesData, fetchTopRatedMoviesData } from "./data.service.js";
import { errorConstants } from "../util/error.js";

export const storeUser = async params => {
    const existingUserCheck = await User.findOne({ id: params.id });

    if (!existingUserCheck) {
        const recommendedMovies = await fetchRecommendedMoviesData();
        const topRatedMovies = await fetchTopRatedMoviesData();

        const user = new User({
            id: params.id,
            name: params.name,
            email: params.email,
            pictureUrl: params.url,
            data: {
                movies: {
                    recommended: [recommendedMovies],
                    topRated: [topRatedMovies]
                }
            },
            date: moment().add(2, 'hours').format()
        });

        await user.save();
    }
};

export const getRecommendedMovies = async (params) => {
    const user = await User.findOne({ id: params.id });

    if (!user) {
        throw errorConstants.MISSING_USER;
    }

    return user.data.movies.recommended;
};

export const getTopRatedMovies = async (params) => {
    const user = await User.findOne({ id: params.id });

    if (!user) {
        throw errorConstants.MISSING_USER;
    }

    return user.data.movies.topRated;
};
