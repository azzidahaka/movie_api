const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * @typedef {Object} Genre
 * @property {string} Name - The name of the genre.
 * @property {string} Description - A description of the genre.
 */

/**
 * @typedef {Object} Director
 * @property {string} Name - The name of the director.
 * @property {string} Bio - A biography of the director.
 * @property {Date} Birth - The birth date of the director.
 * @property {Date} Death - The death date of the director (if applicable).
 */

/**
 * @typedef {Object} Movie
 * @property {string} Title - The title of the movie.
 * @property {string} Description - A description of the movie.
 * @property {Genre} Genre - The genre of the movie.
 * @property {Director} Director - The director of the movie.
 * @property {string[]} Actors - A list of actors in the movie.
 * @property {string} ImagePath - The path to the movie's image.
 * @property {boolean} Featured - Whether the movie is featured.
 */

let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
    Birth: Date,
    Death: Date,
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean,
});

/**
 * @typedef {Object} User
 * @property {string} UserName - The username of the user.
 * @property {string} Password - The password of the user.
 * @property {string} Email - The email of the user.
 * @property {Date} Birthday - The birthday of the user.
 * @property {string[]} FavoriteMovies - A list of the user's favorite movies.
 */

let userSchema = mongoose.Schema({
  UserName: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
});

/**
 * Hashes a password using bcrypt.
 * @function
 * @name hashPassword
 * @memberof module:models.User
 * @param {string} password - The password to hash.
 * @returns {string} The hashed password.
 */
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/**
 * Validates a password.
 * @function
 * @name validatePassword
 * @memberof module:models.User
 * @param {string} password - The password to validate.
 * @returns {boolean} Whether the password is valid.
 */
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
