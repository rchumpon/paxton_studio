import { Link } from "react-router-dom";
function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-gray-900 px-6  lg:px-8">
      <div className="text-center">
        {/* Error Code */}
        <p className="text-base font-semibold text-indigo-400">404</p>

        {/* Error Title */}
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">
          Page not found
        </h1>

        {/* Error Message */}
        <p className="mt-6 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
          Sorry, we could not find the page you are looking for.
        </p>

        {/* Back to Home */}
        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
