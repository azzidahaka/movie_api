//import from packages
const express = require('express'),
  morgan = require('morgan');

const app = express();
//log to console
app.use(morgan('common'));
// Serve static files from the 'public' directory
app.use(express.static('public'));

//Array of movies and director
let movies = [
  {
    Title: 'Silence of the Lambs',
    Description:
      'A young FBI cadet must recieve the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.',
    Director: 'Chris columbus',
  },
  {
    Title: 'The Shawshank Redemption',
    Description:
      'Over the course of several years, two convicts form a friendship, seeking consolation and, eventually, redemption through basic compassion.',
    Director: 'Frank Darabont',
  },
  {
    Title: 'The Godfather',
    Description:
      'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    Director: 'Francis Ford Coppola',
  },
  {
    Title: 'The Dark Knight',
    Description:
      'Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    Director: 'Christopher Nolan',
  },
  {
    Title: '12 Angry Men',
    Description:
      'The jury in a New York City murder trial is frustrated by a single member whose skeptical caution forces them to more carefully consider the evidence before jumping to a hasty verdict.',
    Director: 'Sidney Lumet',
  },
  {
    Title: "Schindler 's List",
    Description:
      'In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.',
    Director: 'Steven Spielberg',
  },
  {
    Title: 'The Lord of the Rings: The Return of the King',
    Description:
      "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
    Director: 'Peter jackson',
  },
  {
    Title: 'Pulp Fiction',
    Description:
      'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    Director: 'Quentin Tarantino',
  },
  {
    Title: 'The Lord of the Rings: The Fellowship of the Ring',
    Description:
      'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
    Director: 'Peter Jackson',
  },
  {
    Title: 'The Good, the Bad and the Ugly',
    Description:
      'A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.',
    Director: 'Sergio Leone',
  },
];

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
app.get('/movies/genre/:genreName', (req, res) => {
  res.send('Successful GET request returning data on all the students');
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
