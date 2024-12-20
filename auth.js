/**
 * @module auth
 */

const jwtSecret = 'your_jwt_secret'; // This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
  passport = require('passport');
require('./passport');

/**
 * Generates a JWT token for a user.
 * @param {Object} user - The user object.
 * @returns {string} The JWT token.
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.UserName, // username encoding in the JWT
    expiresIn: '7d', // token will expire in 7 days
    algorithm: 'HS256', // algorithm used to "sign" or encode the values of the JWT
  });
};

/**
 * @description POST login endpoint to authenticate users.
 * @function
 * @name POST /login
 * @param {Object} router - The Express router object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
