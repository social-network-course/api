import express from 'express';

import * as UserService from '../service/user.service.js';
import { locationMiddleware } from "../util/communication.js";
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

const addToFavouriteGenres = (req, res, next) => {
    UserService.addToFavouriteGenres(req.params, req.body)
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
                    message: 'Error while storing genre.',
                    hasErrors: true
                })
        });
};

const removeFromFavouriteGenres = (req, res, next) => {
    UserService.removeFromFavouriteGenres(req.params, req.body)
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
                    message: 'Error while removing genre.',
                    hasErrors: true
                })
        });
};

const addToLikedList = (req, res, next) => {
    UserService.addToLikedList(req.params, req.body)
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
                    message: 'Error while adding to liked list.',
                    hasErrors: true
                })
        });
};

const removeFromLikedList = (req, res, next) => {
    UserService.removeFromLikedList(req.params, req.body)
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
                    message: 'Error while removing from liked list.',
                    hasErrors: true
                })
        });
};

const addToWatchlist = (req, res, next) => {
    UserService.addToWatchlist(req.params, req.body)
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
                    message: 'Error while adding to watchlist.',
                    hasErrors: true
                })
        });
};

const removeFromWatchlist = (req, res, next) => {
    UserService.removeFromWatchlist(req.params, req.body)
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
                    message: 'Error while removing from watchlist.',
                    hasErrors: true
                })
        });
};

const storeMovieRating = (req, res, next) => {
    UserService.storeMovieRating(req.params, req.body)
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
                    message: 'Error while storing movie rating.',
                    hasErrors: true
                })
        });
};

const storeMovieVisit = (req, res, next) => {
    UserService.storeMovieVisit(req.params, req.body)
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
                    message: 'Error while storing movie visit.',
                    hasErrors: true
                })
        });
};

// routes
userRouter.post('/create', locationMiddleware, storeUser);
userRouter.get('/current', getUserData);
userRouter.post('/:id/genres/add', addToFavouriteGenres);
userRouter.post('/:id/genres/remove', removeFromFavouriteGenres);
userRouter.post('/:id/movies/likes/add', addToLikedList);
userRouter.post('/:id/movies/likes/remove', removeFromLikedList);
userRouter.post('/:id/movies/watchlist/add', addToWatchlist);
userRouter.post('/:id/movies/watchlist/remove', removeFromWatchlist);
userRouter.post('/:id/movies/rate', storeMovieRating);
userRouter.post('/:id/movies/visit', storeMovieVisit);

export default userRouter;