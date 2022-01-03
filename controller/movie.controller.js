import express from 'express';

import * as MovieService from '../service/movie.service.js';
import { logger } from "../util/logging.js";
import { authMiddleware, locationMiddleware } from "../util/communication.js";

const movieRouter = express.Router();

const getGenres = (req, res, next) => {
    MovieService.getGenres()
        .then((genres) => {
            res
                .status(200)
                .send(genres);
        })
        .catch(err => {
            logger.log({
                level: 'error',
                message: err
            });
            res
                .status(500)
                .send({
                    message: 'Error while fetching genres.',
                    hasErrors: true
                });
        });
};

const getStatuses = (req, res, next) => {
    MovieService.getStatuses()
        .then((statuses) => {
            res
                .status(200)
                .send(statuses);
        })
        .catch(err => {
            logger.log({
                level: 'error',
                message: err
            });
            res
                .status(500)
                .send({
                    message: 'Error while fetching statuses.',
                    hasErrors: true
                });
        });
};

const getRecommendedMovies = (req, res, next) => {
    MovieService.getRecommendedMovies(res.locals.user.id, req.query)
        .then((movies) => {
            res
                .status(200)
                .send(movies);
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
                });
        });
};

const getTopRatedMovies = (req, res, next) => {
    MovieService.getTopRatedMovies(req.query)
        .then((movies) => {
            res
                .status(200)
                .send(movies);
        })
        .catch(err => {console.log(err)
            logger.log({
                level: 'error',
                message: err
            });
            res
                .status(500)
                .send({
                    message: 'Error while fetching top rated movies.',
                    hasErrors: true
                });
        });
};

const getPopularMovies = (req, res, next) => {
    MovieService.getPopularMovies(req.query)
        .then((movies) => {
            res
                .status(200)
                .send(movies);
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
                });
        });
};

const getFeaturedMovies = (req, res, next) => {
    MovieService.getFeaturedMovies(req.query)
        .then((movies) => {
            res
                .status(200)
                .send(movies);
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
                });
        });
};

const getMoviesInTheaters = (req, res, next) => {
    MovieService.getMoviesInTheaters(req.query)
        .then((movies) => {
            res
                .status(200)
                .send(movies);
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
                });
        });
};

const getRegionMovies = (req, res, next) => {
    MovieService.getRegionMovies(req.query, res.locals.userLocation)
        .then((movies) => {
            res
                .status(200)
                .send(movies);
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
                });
        });
};

const getTopRevenueMovies = (req, res, next) => {
    MovieService.getTopRevenueMovies(req.query)
        .then((movies) => {
            res
                .status(200)
                .send(movies);
        })
        .catch(err => {
            logger.log({
                level: 'error',
                message: err
            });
            res
                .status(500)
                .send({
                    message: 'Error while fetching top revenue movies.',
                    hasErrors: true
                });
        });
};

const getMostVisitedMovies = (req, res, next) => {
    MovieService.getMostVisitedMovies(req.query)
        .then((movies) => {
            res
                .status(200)
                .send(movies);
        })
        .catch(err => {
            logger.log({
                level: 'error',
                message: err
            });
            res
                .status(500)
                .send({
                    message: 'Error while fetching most visited movies.',
                    hasErrors: true
                });
        });
};

const getMovieDetails = (req, res, next) => {
    MovieService.getMovieDetails(req.params)
        .then((movieDetails) => {
            res
                .status(200)
                .send(movieDetails);
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
                });
        });
};

const getPersonDetails = (req, res, next) => {
    MovieService.getPersonDetails(req.params)
        .then((personDetails) => {
            res
                .status(200)
                .send(personDetails);
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
                });
        });
};

// routes
movieRouter.get('/genres', getGenres);
movieRouter.get('/statuses', getStatuses);
movieRouter.get('/recommended', authMiddleware, getRecommendedMovies);
movieRouter.get('/top-rated', getTopRatedMovies);
movieRouter.get('/popular', getPopularMovies);
movieRouter.get('/featured', getFeaturedMovies);
movieRouter.get('/in-theaters', getMoviesInTheaters);
movieRouter.get('/region', locationMiddleware, getRegionMovies);
movieRouter.get('/top-revenue', getTopRevenueMovies);
movieRouter.get('/most-visited', getMostVisitedMovies);
movieRouter.get('/:id/details', getMovieDetails);
movieRouter.get('/people/:id/details', getPersonDetails);

export default movieRouter;