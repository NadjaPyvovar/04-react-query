import css from './Loader.module.css';

function Loader() {
  return <p className={css.text}>Loading movies, please wait...</p>;
}

export default Loader;

// notes:
// visual placeholder shown instead of gallery while App is fetching request and creating DOM
