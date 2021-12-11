import crypto from 'crypto';
import uniqid from 'uniqid';

import User from '../model/user.model.js';
import Deletion from '../model/deletion.model.js';

export const deleteUser = async ({ signed_request }) => {
    const {
        algorithm,
        expires,
        issued_at,
        user_id
    } = parseSignedRequest(signed_request);

    const confirmationCode = uniqid();

    await User.deleteOne({ id: user_id }, null, (error) => {
        if (!error) {
            new Deletion({ confirmation_code : confirmationCode, user_id: user_id });
        }
    });

    return {
        url: `https://recommend-me-api-v1.herokuapp.com/deletion/status?id=${confirmationCode}`,
        confirmation_code: confirmationCode
    };
};

export const checkStatus = async ({ id }) => {
    return new Promise((resolve) => {
        Deletion.findOne({ id: id }, null, null, async (error, document) => {
            if (!error) {
                const user = await User.findOne({ id: document.user_id });

                resolve(!!user);
            }
        });
    });
};

const parseSignedRequest = (signedRequest) => {
    const encoded_data = signedRequest.split('.', 2);
    const sig = encoded_data[0];
    const json = base64decode(encoded_data[1]);
    const data = JSON.parse(json);

    if (!data.algorithm || data.algorithm.toUpperCase() !== 'HMAC-SHA256') {
        throw Error('Unknown algorithm: ' + data.algorithm + '. Expected HMAC-SHA256');
    }

    const appSecret = process.env.FB_SECRET;
    const expected_sig = crypto.createHmac('sha256', appSecret).update(encoded_data[1]).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace('=', '');

    if (sig !== expected_sig) {
        throw Error('Invalid signature: ' + sig + '. Expected ' + expected_sig);
    }

    return data;
};

const base64decode = (data) => {
    while (data.length % 4 !== 0) {
        data += '=';
    }

    data = data.replace(/-/g, '+').replace(/_/g, '/');

    return new Buffer(data, 'base64').toString('utf-8');
};