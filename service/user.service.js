import moment from 'moment';

import User from '../model/user.model.js';
import { errorConstants } from "../util/error.js";

export const storeUser = async params => {
    const existingUserCheck = await User.findOne({ id: params.id });

    if (!existingUserCheck) {
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
