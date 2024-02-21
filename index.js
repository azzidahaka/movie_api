//import from packages
const express = require('express'),
  morgan = require('morgan');

const app = express();
//log to console
app.use(morgan('common'));
// Serve static files from the 'public' directory
app.use(express.static('public'));

//return message when get is used at "/"
app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});
//return movies in json format
app.get('/movies', (req, res) => {
  res.json(movies);
});
// Gets the data about a single movie, by name
app.get('/movies/:title', (req, res) => {
  res.json(
    movies.find((movie) => {
      return movie.Title === req.params.title;
    })
  );
});
// Gets the data about a genre (description) by name
app.get('/movies/genre/:genreName', async (req, res) => {
  await Movies.find({ 'Genre.Name': req.params.genreName })
    .then((genre) => {
      res.json(genre);
    })
    .catch((err) => {
      consol.error(err);
      res.status(500).send('Error:' + err);
    });
});

// Gets the data about a director by name
app.get('/movies/director/:name', (req, res) => {
  res.send('Successful GET request returning data ');
});
// Gets the data about all users
app.get('/users', (req, res) => {
  res.send('Successful GET request returning data ');
});
// Allow new users to register
app.post('/users', (req, res) => {
  res.send('Successful post request ');
});
// Allow  users to update information
app.put('/users/:name', (req, res) => {
  res.send('Successful put request ');
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
// Deletes a movie from list by ID
app.delete('/movies/:id', (req, res) => {
  let movie = movies.find((movie) => {
    return movie.id === req.params.id;
  });
  if (movie) {
    movies = movies.filter((obj) => {
      return obj.id !== req.params.id;
    });
    res.status(201).send('movie ' + req.params.id + ' was deleted.');
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
