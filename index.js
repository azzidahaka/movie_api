//import from packages
/**
 * Express is a minimal and flexible Node.js web application framework
 * that provides a robust set of features to develop web and mobile applications.
 *
 * @module express
 */
const express = require('express'),
  mongoose = require('mongoose'),
  Models = require('./models.js'),
  morgan = require('morgan');
const { check, validationResult } = require('express-validator');

//mongoose.connect('mongodb://localhost:27017/cfDB');
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
//Assign variables for Model
const Movies = Models.Movie;
const Users = Models.User;
const app = express();
//Use CORS to allow request from all domains
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //bodyparser
//use passport for authentication
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');
//log to console
app.use(morgan('common'));
// Serve static files from the 'public' directory
app.use(express.static('public'));

/**
 * @description Return a welcome message when GET is used at "/".
 * @name GET /
 * @function
 * @memberof module:routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

/**
 * @description Return a list of all movies.
 * @name GET /movies
 * @function
 * @memberof module:routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    });
});

/**
 * @description Return data about a single movie by title.
 * @name GET /movies/:title
 * @function
 * @memberof module:routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ Title: req.params.title })
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    });
});

/**
 * @description Return data about a genre (description) by name.
 * @name GET /movies/genre/:genreName
 * @function
 * @memberof module:routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ 'Genre.Name': req.params.genreName })
    .then((movies) => {
      res.status(201).send(movies.Genre.Description);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    });
});

/**
 * @description Return data about a director by name.
 * @name GET /movies/director/:name
 * @function
 * @memberof module:routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get('/movies/director/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ 'Director.Name': req.params.name })
    .then((movies) => {
      res.status(201).json(movies.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    });
});

/**
 * @description Register a new user.
 * @name POST /users
 * @function
 * @memberof module:routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.post(
  '/users',
  [
    check('UserName', 'Username is required').isLength({ min: 5 }),
    check('UserName', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ UserName: req.body.UserName })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.UserName + ' already exists');
        } else {
          Users.create({
            UserName: req.body.UserName,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  }
);

/**
 * @description Update user information.
 * @name PUT /users/:userName
 * @function
 * @memberof module:routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.put(
  '/users/:userName',
  passport.authenticate('jwt', { session: false }),
  [
    check('UserName', 'Username is required').isLength({ min: 5 }),
    check('UserName', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  async (req, res) => {
    if (req.user.UserName !== req.params.userName) {
      return res.status(400).send('Permission denied');
    }
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOneAndUpdate(
      { UserName: req.params.userName },
      {
        $set: {
          UserName: req.body.UserName,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }
    ) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error:' + err);
      });
  }
);

/**
 * @description Allow users to add a movie to their list of favorites.
 * @name POST /users/:userName/movies/:movieId
 * @function
 * @memberof module:routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.post(
  '/users/:userName/movies/:movieId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.user.UserName !== req.params.userName) {
      return res.status(400).send('Permission denied');
    }
    await Users.findOneAndUpdate(
      { UserName: req.params.userName },
      { $push: { FavoriteMovies: req.params.movieId } },
      { new: true }
    )
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error:' + err);
      });
  }
);

/**
 * @description Allow users to remove a movie from their list of favorites.
 * @name DELETE /users/:userName/movies/:movieId
 * @function
 * @memberof module:routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.delete(
  '/users/:userName/movies/:movieId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.user.UserName !== req.params.userName) {
      return res.status(400).send('Permission denied');
    }
    await Users.findOneAndUpdate(
      { UserName: req.params.userName },
      { $pull: { FavoriteMovies: req.params.movieId } },
      { new: true }
    )
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error:' + err);
      });
  }
);

/**
 * @description Allow existing users to deregister.
 * @name DELETE /users/:userName
 * @function
 * @memberof module:routes
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.delete('/users/:userName', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.UserName !== req.params.userName) {
    return res.status(400).send('Permission denied');
  }
  await Users.findOneAndDelete({ UserName: req.params.userName }, { new: true })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.userName + ' was not found');
      } else {
        res.status(200).send(req.params.userName + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * @description Respond with error message if a request fails.
 * @function
 * @memberof module:routes
 * @inner
 * @param {Object} err - Error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
