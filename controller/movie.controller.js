import express from 'express';

import * as MovieService from '../service/movie.service.js';

const movieRouter = express.Router();

const getRecommendedMovies = (req, res, next) => {
    MovieService.getRecommendedMovies()
        .then((recommendedMovies) => {
            res
                .status(200)
                .send(recommendedMovies)
        })
        .catch(err => {
            console.log(err);
            res
                .status(500)
                .send({
                    message: 'Error while fetching recommended movies.',
                    hasErrors: true
                })
        });
};

const getTopRatedMovies = (req, res, next) => {
    MovieService.getTopRatedMovies()
        .then((topRatedMovies) => {
            res
                .status(200)
                .send(topRatedMovies)
        })
        .catch(err => {
            console.log(err);
            res
                .status(500)
                .send({
                    message: 'Error while fetching top rated movies.',
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
            console.log(err);
            res
                .status(500)
                .send({
                    message: 'Error while fetching movie details',
                    hasErrors: true
                })
        });
};

// routes
movieRouter.get('/recommended', getRecommendedMovies);
movieRouter.get('/top-rated', getTopRatedMovies);
movieRouter.get('/details/:id', getMovieDetails);

export default movieRouter;