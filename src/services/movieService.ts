import axios from 'axios';
import type { Movie } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';

interface FetchMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MoviesResult {
  movies: Movie[];
  totalPages: number;
}

export async function fetchMovies(
  query: string,
  page: number
): Promise<MoviesResult> {
  const response = await axios.get<FetchMoviesResponse>(
    `${BASE_URL}/search/movie`,
    {
      params: {
        query,
        page,
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    }
  );

  return {
    movies: response.data.results,
    totalPages: response.data.total_pages,
  };
}

// notes:
// const BASE_URL => TMDB's API root (kept constant for reusing)
// interface FetchMoviesResponse => the whole response object from TMDB; with: results: Movie[] => array of movies inside
// function fetchMovies => is async function, typed Promise<Movie[]> => calling this function reverts a promise that eventually resoles to an array of movies
// axios.get<FetchMoviesResponse>(url, config) => wherein <FetchMoviesResponse> is generic; response.data is fully typed vs. any
// params: {query} => axios turns into an URL query string (i.e. ? query = mySearchTerm) === TMDB's endpoint /search/movie?query=...
// headers: {Authorization: Bearer${,,,}} => config shape; import.meta.env.VITE_TMDB_TOKEN => Vite injects .env variable into the code
// return response.data.results => function fetchMovies returns an array of movies (not the whole response wrapper, i.e. not a nested Movie object)
// export interface MoviesResult (added for pagination task) => returning an object with both movies and totalPages (and not just array as previously)
// updated for pagination task: adding "page" parameter into function fetchMovies so that TMDB gives the right page; passing page number into params (i.e. TMDB API); returning both the movie list (gallery) and total page count (i.e. movies: response.data.result, totalPages: response.data.total_pages,), as pagination requires total_pages to know how many page buttons to display; adding page as a params so that the users can navigate b/w the pages
