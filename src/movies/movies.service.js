/*const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  created_at: "critic.created_at",
  updated_at: "critic.updated_at",
});

// returns a list of all movies
function list() {
  return knex("movies").select("*");
}

// returns only the movies that are currently showing in theaters
function isShowing() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .distinct("m.*")
    .where({ "mt.is_showing": true })
}

// returns a single movie by ID
function read(movieId) {
  return knex("movies")
    .select("*")
    .where({ "movie_id": movieId })
    .first();
}


// returns all theaters where a movie is playing
function listTheatersShowingMovie(movieId) {
  return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .select("t.*")
    .where({ "mt.movie_id": movieId }, { "is_showing": true });
}


// returns all reviews for a movie, including critic details
function listMovieReviews(movieId) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where({ "r.movie_id": movieId })
    .then((reviews) => reviews.map(addCritic));
}


module.exports = {
  list,
  isShowing,
  read,
  listTheatersShowingMovie,
  listMovieReviews,
} */

const knex = require("../db/connection");
// const mapProperties = require("../utils/map-properties")

function addCritic(movies) {
  return movies.map((movie) => {
    return {
      "review_id": movie.review_id,
      "content": movie.content,
      "score": movie.score,
      "create_at": movie.created_at,
      "update_at": movie.update_at,
      "critic_id": movie.critic_id,
      "movie_id": movie.movie_id,
      "critic": {
        "critic_id": movie.c_critic_id,
        "preferred_name": movie.preferred_name,
        "surname": movie.surname,
        "organization_name": movie.organization_name,
        "created_at": movie.c_created_at,
        "update_at": movie.c_update_at
      }
    }
  })
}

// lists all movies
function list() {
  return knex("movies").select("*").groupBy("movies.movie_id");
}

function showList() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("m.*")
    .where({ "mt.is_showing": true })
    .groupBy("m.movie_id");
}

function listMovieTheaters() {
  return knex("movies_theaters as mt")
    .join("movies as m", "m.movie_id", "mt.movie_id")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .select("t.*")
    .groupBy("t.theater_id");
}

function listMovieReviews(movieId) {
  return knex("movies as m")
    .join("reviews as r", "m.movie_id", "r.movie_id")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select(
      "m.*",
      "r.*",
      "c.created_at as c_created_at",
      "c.updated_at as c_updated_at",
      "c.critic_id as c_critic_id",
      "c.preferred_name",
      "c.surname",
      "c.organization_name",
    )
    .where({ "r.movie_id": movieId })
    .then(addCritic)
}

function read(movie_id) {
  return knex("movies").select("*").where({ movie_id }).first()
}

module.exports = {
  list,
  showList,
  read,
  listMovieTheaters,
  listMovieReviews
}