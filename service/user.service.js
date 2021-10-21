import moment from 'moment';

import User from '../model/user.model.js';
import { fetchMoviesData } from "./data.service.js";

export const storeUser = async params => {
    const existingUserCheck = await User.findOne({ id: params.id });
    let moviesData = null;

    if (!existingUserCheck) {
        moviesData = await fetchMoviesData();

        const user = new User({
            id: params.id,
            name: params.name,
            email: params.email,
            pictureUrl: params.url,
            data: {
                movies: {
                    recommended: [moviesData]
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
