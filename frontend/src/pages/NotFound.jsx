import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center">
      <h1 className="text-8xl font-bold">404</h1>

      <p className="text-softText mt-4">
        Page not found
      </p>

      <Link
        to="/"
        className="mt-6 bg-sky text-white px-6 py-3 rounded-xl"
      >
        Back Home
      </Link>
    </div>
  );
}

export default NotFound;