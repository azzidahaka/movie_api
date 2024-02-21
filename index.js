//import from packages
const express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  Models = require('./models.js'),
  morgan = require('morgan');

mongoose.connect('mongodb://localhost:27017/cfDB');
const app = express();

const Movies = Models.Movie;
const Users = Models.User;
app.use(bodyParser.json());
//log to console
app.use(morgan('common'));
// Serve static files from the 'public' directory
app.use(express.static('public'));

//return message when get is used at "/"
app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});
//return movies in json format
app.get('/movies', async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      consol.error(err);
      res.status(500).send('Error:' + err);
    });
});
//Gets the data about a movie, by name
app.get('/movies/:title', async (req, res) => {
  await Movies.find({ Title: req.params.title })
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      consol.error(err);
      res.status(500).send('Error:' + err);
    });
});
// Gets the data about a genre (description) by name
app.get('/movies/genre/:genreName', async (req, res) => {
  await Movies.find({ 'Genre.Name': req.params.genreName })
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      consol.error(err);
      res.status(500).send('Error:' + err);
    });
});

// Gets the data about a director by name
app.get('/movies/director/:name', async (req, res) => {
  await Movies.find({ 'Director.Name': req.params.name })
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      consol.error(err);
      res.status(500).send('Error:' + err);
    });
});
// Gets the data about all users
app.get('/users', async(req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      consol.error(err);
      res.status(500).send('Error:' + err);
    });
});
//Add a user
/* Expect JSON in this format
{
  ID: Integer,
  UserName: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', async (req, res) => {
  await Users.findOne({ UserName: req.body.UserName })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.UserName + 'already exists');
      } else {
        Users
          .create({
            UserName: req.body.UserName,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Allow  users to update information
/* Expect JSON in this format
{
  UserName: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/users/:userName', async (req, res) => {
  await Users.findOneAndUpdate({ UserName: req.params.userName }, { $set:
    {
      UserName: req.body.UserName,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }) // This line makes sure that the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error:'  + err);
  })

});

// Allow users to add a movie to their list of favorites
app.post('/users/:name/movies/:title', (req, res) => {
  res.send('Successful post request ');
});
// Allow users to remove a movie from their list of favorites
app.delete('/users/:name/movies/:title', (req, res) => {
  res.send('Successful delete request ');
});
// Allow existing users to deregister
app.delete('/users/:name', (req, res) => {
  res.send('Successful delete request ');
});

// Adds data for a new movie to our list of movies.
app.post('/movies', (req, res) => {
  let newMovie = req.body;
  if (!newMovie.Title) {
    const message = 'Missing title in request body';
    res.status(400).send(message);
  } else {
    newMovie.id = uuid.v4();
    movies.push(newMovie);
    res.status(201).send(newMovie);
  }
});
//respond with error message if a request fails
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
