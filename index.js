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
    title: "Harry Potter and the Sorcerer's Stone",
    director: 'Chris columbus',
  },
  {
    title: 'The Lord of the Rings: The Return of the King',
    director: 'Peter Jackson',
  },
  {
    title: 'Twilight',
    director: ' Catherine Hardwicke',
  },
  {
    title: 'The Dark Knight',
    director: 'Christopher Nolan',
  },
  {
    title: '12 Angry Men',
    director: 'Sidney Lumet',
  },
  {
    title: "Schindler 's List",
    director: 'Steven Spielberg',
  },
  {
    title: 'Pulp Fiction',
    director: 'Quentin Tarantino',
  },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    director: 'Peter Jackson',
  },
  {
    title: 'The Good, the Bad and the Ugly',
    director: 'Sergio Leone',
  },
  {
    title: 'The Godfather',
    director: 'Francis Ford Coppola',
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

//respond with error message if a request fails
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
