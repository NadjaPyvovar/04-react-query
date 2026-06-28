import axios from 'axios';
import type { Movie } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';

interface FetchMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function fetchMovies(query: string): Promise<Movie[]> {
  const response = await axios.get<FetchMoviesResponse>(
    `${BASE_URL}/search/movie`,
    {
      params: {
        query,
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    }
  );

  return response.data.results;
}

// notes:

// const BASE_URL => TMDB's API root (kept constant for reusing)
// interface FetchMoviesResponse => the whole response object from TMDB; with: results: Movie[] => array of movies inside
// function fetchMovies => is async function, typed Promise<Movie[]> => calling this function reverts a promise that eventually resoles to an array of movies
// axios.get<FetchMoviesResponse>(url, config) => wherein <FetchMoviesResponse> is generic; response.data is fully typed vs. any
// params: {query} => axios turns into an URL query string (i.e. ? query = mySearchTerm) === TMDB's endpoint /search/movie?query=...
// headers: {Authorization: Bearer${,,,}} => config shape; import.meta.env.VITE_TMDB_TOKEN => Vite injects .env variable into the code
// return response.data.results => function fetchMovies returns an array of movies (not the whole response wrapper, i.e. not a nested Movie object)
