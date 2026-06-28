import { useState, useRef, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

// special import pattern required for React-paginate in Vite 8+
import ReactPaginateModule from 'react-paginate';
import type { ReactPaginateProps } from 'react-paginate';
import type { ComponentType } from 'react';

import css from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';

// adapter required as react-paginate exports differently in Vite 8+, i.e. it extracts the actual component from module's .default property
type ModuleWithDefault<T> = { default: T };
const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

function App() {
  const [query, setQuery] = useState(''); // storing the search query in state
  const [page, setPage] = useState(1); // storing current page number starting with 1
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  // as the toast inside render can fire many times, using useRef to track the last query that showed a toast
  const lastToastedQuery = useRef('');

  // useQuery replaces the entire handleSearch async function & isLoading & isError & movies state; it handles fetching, caching, loading/error states & refetching automatically
  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', query, page], // catch-key re-runs when query / page changes
    queryFn: () => fetchMovies(query, page), // function fetching data
    enabled: query !== '', // no fetch if no search query yet
    placeholderData: keepPreviousData, // keeping current movies visible while new page loads, to prevent "flashing" of the images when page changes
  });

  // extracting movies & totalPages from data
  const movies = data?.movies ?? [];
  const totalPages = data?.totalPages ?? 0;

  // showing toast when no results (only if query is set & data arrived)
  const handleSearch = (newQuery: string) => {
    if (newQuery === query) return; // avoiding re-searching same query
    setQuery(newQuery); // updating query triggers useQuery for automatic re-fetch
    setPage(1); // resetting the page to 1 for new search
  };

  // showing "no results"
  useEffect(() => {
    if (
      !isLoading &&
      !isError &&
      query &&
      movies.length === 0 &&
      lastToastedQuery.current !== query
    ) {
      lastToastedQuery.current = query;
      toast.error('No movies found for your request.');
    }
  }, [isLoading, isError, query, movies.length]);

  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {/* showing pagination when there is > 1 page */}
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages} // total pages' number from TMDB
          pageRangeDisplayed={5} // showing 5 page buttons in the middle
          marginPagesDisplayed={1} //showing 1 page at each end
          onPageChange={({ selected }) => setPage(selected + 1)} // react-paginate uses 0-based index, TMDB 1-based
          forcePage={page - 1} // keeping paginator in sync with state (converting back to 0-based)
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {!isLoading && !isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelect} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;

// notes:
// handleSearch => async function calling fetchMovies (returning Promise), whereas setMovies([]) clears the previous search immediately; setIsLoading(true) & later setIsLoading(false) in finally with finally running whether the request succeeds or fails, the loading stops either way; try {..} catch {setIsError(true);} checking / fixing the errors (i.e. if fetchMovies throws, the error will be caught and error flag will flipped); if (results.length === 0) toast.error(...) => "no movies found" check to be run in App as per assignment
// <Toaster position="top-right" /> => UI component from react-hot-toast rendering toast popups
// conditional rendering part: {isLoading && <Loader />} => showing the loader only when fetching; {isError && <ErrorMessage />} => showing error message if fetch fails; {!isLoading && !isError && movies.length > 0 && <MovieGrid .../>} => grid will only be shown once loading is done, three is no error, and and there is at least one movie;{selectedMovie && <MovieModal .../>} => modal only mounts when a movie is selected, whilst pushing it back to null via handleCloseModal unmounts (and triggering MovieModal cleanup effect)
// updates for the pagination task: adding import {useQuery} from '@tanstack/react-query' to replace manual loading/error state
// adding: import ReactPaginateModule from 'react-paginate'; import type { ReactPaginateProps } from 'react-paginate'; import type { ComponentType } from 'react'; => special import pattern required for react-paginate in Vite 8+
// summary on changes for pagination: priory fetchMovies was called manually, set loading/error/movies state in try/catch check; with useQuery it automatically takes everything over, i.e. it returns {data, isLoading, isError}, whilst also caching results, i.e. navigating back to page 1 doesn't re-fetch if nothing changed
