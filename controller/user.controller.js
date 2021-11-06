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
            console.log(err);
            res
                .status(500)
                .send({
                    message: 'Error while storing user data.',
                    hasErrors: true
                })
        });
};

const getUserData = (req, res, next) => {
    UserService.getUserData(req.query)
        .then((data) => {
            res
                .status(201)
                .send(data)
        })
        .catch(err => {
            console.log(err);
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
            console.log(err);
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
            console.log(err);
            res
                .status(500)
                .send({
                    message: 'Error while storing user like.',
                    hasErrors: true
                })
        });
};

const getUserLikedMovies = (req, res, next) => {
    UserService.getUserLikes(req.params)
        .then((likedMovies) => {
            res
                .status(200)
                .send(likedMovies)
        })
        .catch(err => {
            console.log(err);
            res
                .status(500)
                .send({
                    message: 'Error while fetching liked movies.',
                    hasErrors: true
                })
        });
};

// routes
userRouter.post('/create', storeUser);
userRouter.post('/data/:userId', getUserData);
userRouter.post('/:userId/movies/like', storeUserLike);
userRouter.post('/:userId/movies/unlike', storeUserUnlike);
userRouter.get('/:userId/movies/likes', getUserLikedMovies);

export default userRouter;