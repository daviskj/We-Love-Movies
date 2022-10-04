/*const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


// validation middleware
async function movieExists(req, res, next) {
  const movie = await moviesService.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  
  next({ status: 404, message: "Movie cannot be found."});
}

async function list(req, res, next) {
  const showing = req.query.is_showing;
  if (showing) {
    const showingMovies = await moviesService.isShowing();
    res.json({ data: showingMovies });
  } else {
    const allMovies = await moviesService.list();
    res.json({ data: allMovies });
  }
}

function read(req, res) {
  res.json({ data: res.locals.movie });
}

async function listTheatersShowingMovie(req, res) {
  const { movie } = res.locals;
  const theaters = await moviesService.listTheatersShowingMovie(movie.movie_id);
  res.json({ data: theaters });
}

async function listMovieReviews(req, res) {
  const { movie } = res.locals;
  const data = await moviesService.listMovieReviews(movie.movie_id);
  res.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [
    asyncErrorBoundary(movieExists), 
    read,
  ],
  listTheatersShowingMovie: [
    asyncErrorBoundary(movieExists), 
    asyncErrorBoundary(listTheatersShowingMovie),
  ],
  listMovieReviews: [
    asyncErrorBoundary(movieExists), 
    asyncErrorBoundary(listMovieReviews)
  ],
}
*/

const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// handler to get all movies
async function list(req, res, next) {
  const { is_showing } = req.query
  if (is_showing) {
    res.json({ data: await service.showList() });
  }
  res.json({ data: await service.list() });
};

// handler to get 1 movie
async function read(req, res, next) {
  res.json({ data: res.locals.movie });
};

// handler for movie theaters
async function listMovieTheaters(req, res, next) {
  const movieId = req.params.movieId;
  res.json({ data: await service.listMovieTheaters(movieId) });
};

// handler for movie reviews
async function listMovieReviews(req, res, next) {
  const movieId = req.params.movieId;
  const result = await service.listMovieReviews(movieId);
  res.json({ data: result });
};

// check if the movie_id exists
async function movieIsValid(req, res, next) {
  const movie = await service.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie
    // console.log(movieId)
    return next()
  }
  next({ status: 404, message: "Movie cannot be found" })
};

// export handlers
module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieIsValid), asyncErrorBoundary(read)],
  listMovieTheaters: [
    asyncErrorBoundary(movieIsValid),
    asyncErrorBoundary(listMovieTheaters)
  ],
  listMovieReviews: [
    asyncErrorBoundary(movieIsValid),
    asyncErrorBoundary(listMovieReviews)
  ],
};