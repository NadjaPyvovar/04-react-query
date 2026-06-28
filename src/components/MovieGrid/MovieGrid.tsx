import css from './MovieGrid.module.css';
import type { Movie } from '../../types/movie';

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

function MovieGrid({ movies, onSelect }: MovieGridProps) {
  return (
    <ul className={css.grid}>
      {movies.map(movie => (
        <li key={movie.id}>
          <div className={css.card} onClick={() => onSelect(movie)}>
            <img
              className={css.image}
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : '/placeholder.svg'
              }
              alt={movie.title}
              loading="lazy"
            />
            <h2 className={css.title}>{movie.title}</h2>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default MovieGrid;

// notes:
// movies.map(movie => ()) rendering one <li> per movie
// key={movie.id}: unique key per list item, so that React allocates data when the list changes to the respective DOM element
// onClick={() => onSelect(movie)} => clicking anywhere on the <li> (as the whole card should be clickable) will call onSelect, passing the specific movie clicked
// src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} => TMDB gives only the path (not a full URL), real img url to be built by prefixing TMDB's image base & ia size code(w500)
