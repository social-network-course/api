import express from 'express';

import * as UserService from '../service/user.service.js';
import { ipMiddleware } from "../util/communication.js";
import { logger } from "../util/logging.js";

const userRouter = express.Router();

const storeUser = (req, res, next) => {
    UserService.storeUser(req.body, res.locals.userLocation)
        .then(() => {
            res
                .status(201)
                .send({
                    message: 'Successfully stored user data.',
                    hasErrors: false
                })
        })
        .catch(err => {
            logger.log({
                level: 'error',
                message: err
            });
            res
                .status(500)
                .send({
                    message: 'Error while storing user data.',
                    hasErrors: true
                })
        });
};

const getUserData = (req, res, next) => {
    UserService.getUserData(res.locals.user)
        .then((data) => {
            res
                .status(200)
                .send(data)
        })
        .catch(err => {
            logger.log({
                level: 'error',
                message: err
            });
            res
                .status(500)
                .send({
                    message: 'Error while fetching user data.',
                    hasErrors: true
                })
        });
};

const storeUserLike = (req, res, next) => {
    UserService.storeUserLike(req.params, req.body)
        .then((id) => {
            res
                .status(200)
                .send(id.toString())
        })
        .catch(err => {
            logger.log({
                level: 'error',
                message: err
            });
            res
                .status(500)
                .send({
                    message: 'Error while storing user like.',
                    hasErrors: true
                })
        });
};

const storeUserUnlike = (req, res, next) => {
    UserService.storeUserUnlike(req.params, req.body)
        .then((id) => {
            res
                .status(200)
                .send(id.toString())
        })
        .catch(err => {
            logger.log({
                level: 'error',
                message: err
            });
            res
                .status(500)
                .send({
                    message: 'Error while storing user like.',
                    hasErrors: true
                })
        });
};

const addToUserWatchlist = (req, res, next) => {
    UserService.addToUserWatchlist(req.params, req.body)
        .then((id) => {
            res
                .status(200)
                .send(id.toString())
        })
        .catch(err => {
            logger.log({
                level: 'error',
                message: err
            });
            res
                .status(500)
                .send({
                    message: 'Error while storing user like.',
                    hasErrors: true
                })
        });
};

const removeFromUserWatchlist = (req, res, next) => {
    UserService.removeFromUserWatchlist(req.params, req.body)
        .then((id) => {
            res
                .status(200)
                .send(id.toString())
        })
        .catch(err => {
            logger.log({
                level: 'error',
                message: err
            });
            res
                .status(500)
                .send({
                    message: 'Error while storing user like.',
                    hasErrors: true
                })
        });
};

const storeMovieRating = (req, res, next) => {
    UserService.storeMovieRating(req.params, req.body)
        .then((rating) => {
            res
                .status(200)
                .send(rating)
        })
        .catch(err => {
            logger.log({
                level: 'error',
                message: err
            });
            res
                .status(500)
                .send({
                    message: 'Error while storing movie rating.',
                    hasErrors: true
                })
        });
};

// routes
userRouter.post('/create', ipMiddleware, storeUser);
userRouter.get('/current', getUserData);
userRouter.post('/:id/movies/likes/add', storeUserLike);
userRouter.post('/:id/movies/likes/remove', storeUserUnlike);
userRouter.post('/:id/movies/watchlist/add', addToUserWatchlist);
userRouter.post('/:id/movies/watchlist/remove', removeFromUserWatchlist);
userRouter.post('/:id/movies/rate', storeMovieRating);

export default userRouter;