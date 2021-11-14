import express from 'express';

import * as MovieService from '../service/movie.service.js';
import { logger } from "../util/logging.js";

const movieRouter = express.Router();

const getRecommendedMovies = (req, res, next) => {
    MovieService.getRecommendedMovies(req.query)
        .then((movies) => {
            res
                .status(200)
                .send(movies)
        })
        .catch(err => {
            logger.log({
                level: 'error',
                message: err
            });
            res
                .status(500)
                .send({
                    message: 'Error while fetching recommended movies.',
                    hasErrors: true
                })
        });
};

const getTopRatedMovies = (req, res, next) => {
    MovieService.getTopRatedMovies(req.query)
        .then((movies) => {
            res
                .status(200)
                .send(movies)
        })
        .catch(err => {
            logger.log({
                level: 'error',
                message: err
            });
            res
                .status(500)
                .send({
                    message: 'Error while fetching top rated movies.',
                    hasErrors: true
                })
        });
};

const getPopularMovies = (req, res, next) => {
    MovieService.getPopularMovies(req.query)
        .then((movies) => {
            res
                .status(200)
                .send(movies)
        })
        .catch(err => {
            logger.log({
                level: 'error',
                message: err
            });
            res
                .status(500)
                .send({
                    message: 'Error while fetching popular movies.',
                    hasErrors: true
                })
        });
};

const getFeaturedMovies = (req, res, next) => {
    MovieService.getFeaturedMovies(req.query)
        .then((movies) => {
            res
                .status(200)
                .send(movies)
        })
        .catch(err => {
            logger.log({
                level: 'error',
                message: err
            });
            res
                .status(500)
                .send({
                    message: 'Error while fetching featured movies.',
                    hasErrors: true
                })
        });
};

const getMoviesInTheaters = (req, res, next) => {
    MovieService.getMoviesInTheaters(req.query)
        .then((movies) => {
            res
                .status(200)
                .send(movies)
        })
        .catch(err => {
            logger.log({
                level: 'error',
                message: err
            });
            res
                .status(500)
                .send({
                    message: 'Error while fetching movies in theaters.',
                    hasErrors: true
                })
        });
};

const getRegionMovies = (req, res, next) => {
    MovieService.getRegionMovies(req.query)
        .then((movies) => {
            res
                .status(200)
                .send(movies)
        })
        .catch(err => {
            logger.log({
                level: 'error',
                message: err
            });
            res
                .status(500)
                .send({
                    message: 'Error while fetching region movies.',
                    hasErrors: true
                })
        });
};

const getMovieDetails = (req, res, next) => {
    MovieService.getMovieDetails(req.params)
        .then((movieDetails) => {
            res
                .status(200)
                .send(movieDetails)
        })
        .catch(err => {
            logger.log({
                level: 'error',
                message: err
            });
            res
                .status(500)
                .send({
                    message: 'Error while fetching movie details.',
                    hasErrors: true
                })
        });
};

// routes
movieRouter.get('/', getRegionMovies);
movieRouter.get('/recommended', getRecommendedMovies);
movieRouter.get('/top-rated', getTopRatedMovies);
movieRouter.get('/popular', getPopularMovies);
movieRouter.get('/featured', getFeaturedMovies);
movieRouter.get('/in-theaters', getMoviesInTheaters);
movieRouter.get('/details/:id', getMovieDetails);

export default movieRouter;