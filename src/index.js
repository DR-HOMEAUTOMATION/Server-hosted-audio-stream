const express = require('express');
const app = express();

const {audioServer,sockets} = require('./socket')
const packageJson = require('../package.json')
const ServerUpdater = require('./autoUpdater')



const routes = {
  "/":"display all possible routs",
  "/exit":"exit the process",
  "/update":"update the process",
  sockets:{
    "3000":"streams mic data `tcp`"
  }
}

const gitConfig = {
  repository: packageJson.repository.url ,
  formReleases:false,
  branch:'raspi-dev',
  tempLocation:'/home/pi/backups/SHAS',
  executeOnComplete:`sh start.sh`,
  exitOnComplete:true
}

require('dotenv').config();

const middlewares = require('./middlewares');



app.get('/', (req, res) => {
  res.json(routes);
});

app.get('/exit', (req, res) => {
  res.json('server closing');
  process.exit(1)
});

app.get('/update', (req, res) => {
  res.json('updating server');
  updater.update(); 
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);


const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});


const updater = new ServerUpdater({http:[server]},gitConfig)