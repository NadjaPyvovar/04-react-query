import toast from 'react-hot-toast';
import css from './SearchBar.module.css';

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

function SearchBar({ onSubmit }: SearchBarProps) {
  const handleSubmit = (formData: FormData) => {
    const query = (formData.get('query') as string)?.trim();

    if (!query) {
      toast.error('Please enter your search query.');
      return;
    }
    onSubmit(query);
  };

  return (
    <header className={css.header}>
      <div className={css.container}>
        <a
          className={css.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>

        <form className={css.form} action={handleSubmit}>
          <input
            className={css.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
          />
          <button className={css.button} type="submit">
            Search
          </button>
        </form>
      </div>
    </header>
  );
}

export default SearchBar;

// notes:
// component SearchBar gets one props onSubmit (function for passing down the input value while form processing)
// using Form Actions (instead of onSubmit={e => {e.preventDefault(); ...}} & manually reading e.target.elements), passing the function directly to <form action={...}, so that React preventing default page reload, collecting form's input into FormData object, calling the function with FormData, resetting the form after submission
// (formData: FormData) => {...}, where FormData built-in browser API repres. form input values (as key-value pair)
// formData.get("query"), where query matching the name="query" attribute on <input>, assuring React knows which field to read
// as string (as FormData.get() returns FormDataEntryValue | null by type, string type is assured here (i.e. input is a text)); ?.tirm() optional chaining (if query is null, undefined will be returned); .trim() deleting whitespaces, if any
// if(!query) checking for any "", undefined, or whitespace-input and reverting a request to enter searching word
// toast.error(...) => library React Hot Toast providing red error toast
// onSubmit(query) => only called if query is a valid non-empty string (i.e. this call the function SearchBar passes down from App)
