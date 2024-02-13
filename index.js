//import from packages
const express = require('express'),
  fs = require('fs'),
  morgan = require('morgan');

const app = express();
// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use('/documentation.html', express.static('public')); //use express to serve documentation.html

//return message when get is used at "/"
app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
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
