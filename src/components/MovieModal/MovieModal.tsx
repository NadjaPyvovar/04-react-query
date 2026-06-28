import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import css from './MovieModal.module.css';
import type { Movie } from '../../types/movie';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

function MovieModal({ movie, onClose }: MovieModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>
        <button
          className={css.closeButton}
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>
        <img
          className={css.image}
          src={
            movie.backdrop_path
              ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
              : '/placeholder.svg'
          }
          alt={movie.title}
        />
        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average}/10
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default MovieModal;

// notes:
// createPortal(jsxToRender, targetDOMNode): as portal indicates React to render JSX's actual DOM elsewhere, here into document.body instead of wherever <MovieModal> sits inside <App> (i.e. the modal's DOM is a sibling of everything else, not nested inside it)
// useEffect => runs side effects (i.e. things outside of rendering, i.e. event listeners, DOM mutations) when the component mounts: handleKeyDown (the function checking if the pressed key is "Escape", if so - closes the modal); document.addEventListener("keydown", handleKeyDown) => listening for key presses anywhere on the page (not only inside the modal), since pressing Escape should work regardless of focus; document.body.style.overflow = "hidden" => disables page scrolling whilst the modal is open
// return () => {...} => a cleanup function, run automatically by React when the component unmounts (i.e. when onClose sets selectedMovie to null in App, removing <MovieModal> from DOM) (it removes the keydown listener and restores scrolling); [onClose] => dependency array (re-runs only if onClose changes)
// handleBackdropClick with event.target === event.currentTarget => assures "close on click outside" behavior
// onClick={onClose} => the close button, closes the Modal when the "x" is clicked
