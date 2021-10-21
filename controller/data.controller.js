import express from 'express';

import * as DataService from '../service/data.service.js';

const dataRouter = express.Router();

const storeData = (req, res, next) => {
    DataService.storeData(req.body)
        .then(() => {
            res
                .status(201)
                .send({
                    message: 'Successfully registered.',
                    hasErrors: false
                })
        })
        .catch(err => {
            next(err);
        });
}

// routes
dataRouter.get('/store', storeData);

export default dataRouter;