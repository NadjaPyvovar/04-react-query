import css from './ErrorMessage.module.css';

function ErrorMessage() {
  return <p className={css.text}>There was an error, please try again...</p>;
}

export default ErrorMessage;

// notes:
// rendering instead of gallery in case of an error for HTTP-request and creating DOM element
