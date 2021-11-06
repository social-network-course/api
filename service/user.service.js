import moment from 'moment';

import User from '../model/user.model.js';
import { errorConstants } from "../util/error.js";

export const storeUser = async params => {
    const user = await User.findOne({ id: params.id });

    if (user) {
        throw errorConstants.ALREADY_EXISTING_USER;
    } else {
        const user = new User({
            id: params.id,
            name: params.name,
            email: params.email,
            pictureUrl: params.url,
            timestamp: moment().add(2, 'hours').format()
        });

        await user.save();
    }
};

export const getUserData = async params => {
    const user = await User.findOne({ id: params.id });

    if (!user) {
        throw errorConstants.MISSING_USER;
    } else {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            pictureUrl: user.url
        };
    }
};

export const storeUserLike = async ({ userId }, { movieId }) => {
    if (!userId) {
        throw errorConstants.MISSING_USER_ID;
    } else if (!movieId) {
        throw errorConstants.MISSING_MOVIE_ID;
    } else {
        return new Promise((resolve, reject) => {
            User.findOneAndUpdate({ id: userId }, { '$addToSet': { 'likes': movieId } }, (error, success) => {
                if (error) {
                    throw errorConstants.STORING_DATA_FAILED;
                } else {
                    resolve(movieId);
                }
            });
        });
    }
};

export const storeUserUnlike = async ({ userId }, { movieId }) => {
    if (!userId) {
        throw errorConstants.MISSING_USER_ID;
    } else if (!movieId) {
        throw errorConstants.MISSING_MOVIE_ID;
    } else {
        return new Promise((resolve, reject) => {
            User.findOneAndUpdate({ id: userId }, { '$pull': { 'likes': movieId } }, (error, success) => {
                if (error) {
                    throw errorConstants.STORING_DATA_FAILED;
                } else {
                    return resolve(movieId);
                }
            });
        });
    }
};

export const getUserLikes = async ({ userId }) => {
    const user = await User.findOne({ id: userId });

    if (!user) {
        throw errorConstants.MISSING_USER;
    } else {
        return user.likes;
    }
};
