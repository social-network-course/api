import { fetchPopularShows } from "../client/movie.client.js";

export const getPopularShows = async () => {
    const shows = await fetchPopularShows();

    return shows;
};