import express from 'express';

import * as UserService from '../service/user.service.js';

const userRouter = express.Router();

const storeUser = (req, res, next) => {
    UserService.storeUser(req.body)
        .then(() => {
            res
                .status(201)
                .send({
                    message: 'Successfully stored user data.',
                    hasErrors: false
                })
        })
        .catch(err => {
            res
                .status(500)
                .send({
                    message: 'Error while storing user data.',
                    hasErrors: true
                })
        });
};

const getRecommendedMovies = (req, res, next) => {
    UserService.getRecommendedMovies(req.params)
        .then((recommendedMovies) => {
            res
                .status(200)
                .send(recommendedMovies)
        })
        .catch(err => {
            console.log(err)
            res
                .status(500)
                .send({
                    message: 'Error while fetching recommended movies',
                    hasErrors: true
                })
        });
};

const getTopRatedMovies = (req, res, next) => {
    UserService.getTopRatedMovies(req.params)
        .then((topRatedMovies) => {
            res
                .status(200)
                .send(topRatedMovies)
        })
        .catch(err => {
            console.log(err)
            res
                .status(500)
                .send({
                    message: 'Error while fetching top rated movies',
                    hasErrors: true
                })
        });
};

// routes
userRouter.post('/create', storeUser);
userRouter.get('/:id/recommended-movies', getRecommendedMovies);
userRouter.get('/:id/top-rated-movies', getTopRatedMovies);

export default userRouter;