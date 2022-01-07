import express from 'express';

import * as ShowService from '../service/show.service.js';
import { logger } from "../util/logging.js";

const showRouter = express.Router();

const getPopularShows = (req, res, next) => {
    ShowService.getPopularShows()
        .then((shows) => {
            res
                .status(200)
                .send(shows)
        })
        .catch(err => {
            logger.log({
                level: 'error',
                message: err
            });
            res
                .status(500)
                .send({
                    message: 'Error while fetching popular shows.',
                    hasErrors: true
                })
        });
};

showRouter.get('/popular', getPopularShows);

export default showRouter;