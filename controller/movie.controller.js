import express from 'express';

import * as MovieService from '../service/movie.service.js';
import { logger } from "../util/logging.js";
import { authMiddleware, locationMiddleware } from "../util/communication.js";

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
    MovieService.getRegionMovies(req.query, res.locals.userLocation)
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

const getLatestMovie = (req, res, next) => {
    MovieService.getLatestMovie()
        .then((movie) => {
            res
                .status(200)
                .send(movie)
        })
        .catch(err => {
            logger.log({
                level: 'error',
                message: err
            });
            res
                .status(500)
                .send({
                    message: 'Error while fetching latest movie.',
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

const getPersonDetails = (req, res, next) => {
    MovieService.getPersonDetails(req.params)
        .then((personDetails) => {
            res
                .status(200)
                .send(personDetails)
        })
        .catch(err => {
            logger.log({
                level: 'error',
                message: err
            });
            res
                .status(500)
                .send({
                    message: 'Error while fetching person details.',
                    hasErrors: true
                })
        });
};

// routes
movieRouter.get('/', locationMiddleware, getRegionMovies);
movieRouter.get('/recommended', authMiddleware, getRecommendedMovies);
movieRouter.get('/top-rated', getTopRatedMovies);
movieRouter.get('/popular', getPopularMovies);
movieRouter.get('/featured', getFeaturedMovies);
movieRouter.get('/in-theaters', getMoviesInTheaters);
movieRouter.get('/latest', getLatestMovie);
movieRouter.get('/:id/details', getMovieDetails);
movieRouter.get('/people/:id/details', getPersonDetails);

export default movieRouter;