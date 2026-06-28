import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import css from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    setMovies([]);
    setIsError(false);
    setIsLoading(true);

    try {
      const results = await fetchMovies(query);

      if (results.length === 0) {
        toast.error('No movies found for your request.');
      }

      setMovies(results);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

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
