const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  passportJWT = require('passport-jwt');

let Users = require('./models.js').User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

/**
 * @description Local strategy for authenticating users using a username and password.
 * @function
 * @name LocalStrategy
 * @memberof module:passport
 * @param {string} usernameField - The field name for the username.
 * @param {string} passwordField - The field name for the password.
 * @param {function} callback - The callback function to execute after authentication.
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: 'UserName',
      passwordField: 'Password',
    },
    async (username, password, callback) => {
      console.log(`${username} ${password}`);
      await Users.findOne({ UserName: username })
        .then((user) => {
          if (!user) {
            console.log('incorrect username');
            return callback(null, false, {
              message: 'Incorrect username or password.',
            });
          }
          if (!user.validatePassword(password)) {
            console.log('incorrect password');
            return callback(null, false, { message: 'Incorrect password.' });
          }
          console.log('finished');
          return callback(null, user);
        })
        .catch((error) => {
          if (error) {
            console.log(error);
            return callback(error);
          }
        });
    }
  )
);

/**
 * @description JWT strategy for authenticating users using a JWT token.
 * @function
 * @name JWTStrategy
 * @memberof module:passport
 * @param {function} jwtFromRequest - Function to extract the JWT token from the request.
 * @param {string} secretOrKey - The secret key used to verify the JWT token.
 * @param {function} callback - The callback function to execute after authentication.
 */
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your_jwt_secret',
    },
    async (jwtPayload, callback) => {
      return await Users.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((error) => {
          return callback(error);
        });
    }
  )
);
