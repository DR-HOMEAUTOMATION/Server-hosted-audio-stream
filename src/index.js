const socketServer = require('./socket')

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

require('dotenv').config();

const middlewares = require('./middlewares');


app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

const routes = {
  "/":"display all possible routs",
  "/exit":"exit the process",
  "/update":"update the process",
  sockets:{
    "3000":"streams mic data `tcp`"
  }
}


app.get('/exit', (req, res) => {
  res.json(routes);
  socketServer.close(()=>console.log('socket closed'))
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;


const port = process.env.PORT || 5000;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
