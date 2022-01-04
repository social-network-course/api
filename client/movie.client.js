import fetch from "node-fetch";
import moment from "moment";
import words from 'profane-words';

import Movie from '../model/movie.model.js';
import Genre from '../model/genre.model.js';
import { appendApiKey, defaultHeaders } from "../util/communication.js";

const NUMBER_OF_PAGES = 100;

export const fetchMovies = async () => {
    const movieDbUrl = process.env.MOVIEDB_URL;

    await Movie.deleteMany({});

    try {
        for (let i = 1; i <= NUMBER_OF_PAGES; i++) {
            const moviesResponse = await fetch(appendApiKey(`${movieDbUrl}/movie/popular`).concat(`&page=${i}`), {
                    method: 'GET',
                    headers: defaultHeaders
                }
            );

            moviesResponse.json().then((data) => {
                data.results.map(async (movieObj) => {
                    const { id } = movieObj;
                    const details = await fetchMovieDetails(id);

                    if (!words.some((profanity) => details.title.includes(profanity.trim().toLowerCase()))) {
                        const movie = new Movie({
                            ...details,
                            timestamp: moment().add(2, 'hours').format()
                        });

                        await movie.save();
                    }
                });
            });
        }
    } catch (err) {
        console.error(err);
    }
};

export const fetchGenres = async () => {
    const movieDbUrl = process.env.MOVIEDB_URL;

    await Genre.deleteMany({});

    try {
        const genresResponse = await fetch(appendApiKey(`${movieDbUrl}/genre/movie/list`), {
                method: 'GET',
                headers: defaultHeaders
            }
        );

        genresResponse.json().then((data) => {
            data.genres.map(async (genreObj) => {
                const { id, name } = genreObj;

                const genre = new Genre({
                    id,
                    name,
                    timestamp: moment().add(2, 'hours').format()
                });

                await genre.save();
            });
        });
    } catch (err) {
        console.error(err);
    }
};

export const fetchMovieDetails = async (id) => {
    const tmdbResponse = await fetchTmdbDetails(id);

    let omdbResponse;
    if (tmdbResponse.imdb_id) {
        omdbResponse = await fetchOmdbDetails(tmdbResponse.imdb_id);

    }
    const cast = await fetchMovieCast(id);

    const details = {
        ...tmdbResponse,
        ...cast,
        ...omdbResponse
    }

    return details;
};

const fetchTmdbDetails = async (id) => {
    const movieDbUrl = process.env.MOVIEDB_URL;

    try {
        const response = await fetch(appendApiKey(`${movieDbUrl}/movie/${id}`).concat('&append_to_response=videos'), {
                method: 'GET',
                headers: defaultHeaders
            }
        );

        return await response.json();
    } catch (err) {
        console.error(err);
        return null;
    }
};

const fetchOmdbDetails = async (imdbId) => {
    const omdbUrl = process.env.OMDB_URL;
    const omdbApiKey = process.env.OMDB_API_KEY;

    try {
        const response = await fetch(`${omdbUrl}?apikey=${omdbApiKey}&i=${imdbId}`, {
                method: 'GET',
                headers: defaultHeaders
            }
        );

        const omdbResponseJson = await response.json();
        const socialRatings = omdbResponseJson.Response === 'False' ? null : omdbResponseJson.Ratings;

        return {
            social_ratings: socialRatings
        };
    } catch (err) {
        console.error(err);
        return null;
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
        return null;
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
