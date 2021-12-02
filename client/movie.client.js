import fetch from "node-fetch";
import moment from "moment";

import Movie from '../model/movie.model.js';
import { appendApiKey, defaultHeaders } from "../util/communication.js";

const NUMBER_OF_PAGES = 40;

export const fetchMovies = async () => {
    const movieDbUrl = process.env.MOVIEDB_URL;

    await Movie.deleteMany({});

    for (let i = 1; i <= NUMBER_OF_PAGES; i++) {
        try {
            const response = await fetch(appendApiKey(`${movieDbUrl}/movie/popular`).concat(`&page=${i}`), {
                    method: 'GET',
                    headers: defaultHeaders
                }
            );

            response.json().then((data) => {
                data.results.map(async (movieObj) => {
                    const { id } = movieObj;
                    const details = await fetchMovieDetails(id);
                    const cast = await fetchMovieCast(id);
                    const fullDetails = {...details, ...cast};

                    const movie = new Movie({
                        ...fullDetails,
                        timestamp: moment().add(2, 'hours').format()
                    });

                    await movie.save();
                });
            });
        } catch (err) {
            console.error(err);
        }
    }
};

export const fetchMovieDetails = async (id) => {
    const movieDbUrl = process.env.MOVIEDB_URL;

    const omdbUrl = process.env.OMDB_URL;
    const omdbApiKey = process.env.OMDB_API_KEY;

    try {
        const movieDbResponse = await fetch(appendApiKey(`${movieDbUrl}/movie/${id}`).concat('&append_to_response=videos'), {
                method: 'GET',
                headers: defaultHeaders
            }
        );

        const movieDbResponseJson = await movieDbResponse.json();

        const omdbResponse = await fetch(`${omdbUrl}?apikey=${omdbApiKey}&i=${movieDbResponseJson.imdb_id}`, {
                method: 'GET',
                headers: defaultHeaders
            }
        );

        const omdbResponseJson = await omdbResponse.json();

        const cast = await fetchMovieCast(id);

        const social_ratings = omdbResponseJson.Response === 'False' ? null : omdbResponseJson.Ratings;

        const response = {
            ...movieDbResponseJson,
            ...cast,
            social_ratings: social_ratings
        }

        return response;
    } catch (err) {
        console.error(err);
    }
};

const fetchMovieCast = async (id) => {
    const movieDbUrl = process.env.MOVIEDB_URL;

    try {
        const response = await fetch(appendApiKey(`${movieDbUrl}/movie/${id}/credits`), {
                method: 'GET',
                headers: defaultHeaders
            }
        );

        return response.json();
    } catch (err) {
        console.error(err);
    }
};

export const fetchRegionMovies = async (region, limit) => {
    const movieDbUrl = process.env.MOVIEDB_URL;

    try {
        const response = await fetch(appendApiKey(`${movieDbUrl}/movie/popular`).concat(`&region=${region.toUpperCase()}`), {
                method: 'GET',
                headers: defaultHeaders
            }
        );

        const jsonResponse = await response.json();

        const mappedDetails = jsonResponse.results.map((movie) => ({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            vote_average: movie.vote_average
        }));

        return { results: mappedDetails };
    } catch (err) {
        console.error(err);
    }
};

export const fetchPersonDetails = async (id) => {
    const movieDbUrl = process.env.MOVIEDB_URL;

    try {
        const response = await fetch(appendApiKey(`${movieDbUrl}/person/${id}`), {
                method: 'GET',
                headers: defaultHeaders
            }
        );

        return response.json();
    } catch (err) {
        console.error(err);
    }
};
