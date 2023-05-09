//// Load most basic dependencies
// Create require function 
// https://nodejs.org/docs/latest-v18.x/api/module.html#modulecreaterequirefilename
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
// The above two lines allow us to use ES methods and CJS methods for loading
// dependencies.
// Load minimist for command line argument parsing
// https://www.npmjs.com/package/minimist
const minimist = require('minimist')
// Parse our command line arguments
const args = minimist(process.argv.slice(2))
// Are we debugging or testing?
// If so, then let's look at our command line arguments just to see what is in there
if (args.debug) {
    console.info('Minimist parsed and created the following `args` object:')
    console.info(args)
}
// Did we call for help? 
if (args.h || args.help) {
    console.log(`
usage: node server.js --port=5000

This package serves the static HTML, CSS, and JS files in a /public directory.
It also creates logs in a common log format (CLF) so that you can better.

  --stat,  -s    Specify the directory for static files to be served
                    Default: ./public/
  --port, -p    Specify the port for the HTTP server to listen on
                    Default: 8080
  --log,  -l    Specify the directory for the log files
                    Default: ./log/
  --help, -h    Displays this help message and exit 0 
                    (Does not work when run with nodemon)
  --debug       Echos more information to STDOUT so that you can see what is
                    stored in internal variables, etc.
    `)
    process.exit(0)
} 
// Load express and other dependencies for serving HTML, CSS, and JS files
import express from 'express'
// Use CJS __filename and __dirname in ES module scope
// https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// Load dependencies for logging
const fs = require('fs')
const morgan = require('morgan')
// Create log path
const logpath = args.log || args.l || process.env.LOGPATH || path.join(__dirname, 'log')
if (!fs.existsSync(logpath)){
    fs.mkdirSync(logpath);
}
if (args.debug) {
    console.info('HTTP server is logging to this directory:')
    console.info(logpath)
}
// Create an app server
const app = express()
// Set a port for the server to listen on
const port = args.port || args.p || process.env.PORT || 8080
// Load app middleware here to serve routes, accept data requests, etc.
//
// Create and update access log
// The morgan format below is the Apache Foundation combined format but with ISO8601 dates
app.use(morgan(':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
    {stream: fs.createWriteStream(path.join(logpath, 'access.log')), flags: 'a' }
))
// Serve static files
const staticpath = args.stat || args.s || process.env.STATICPATH || path.join(__dirname, 'public')
app.use('/', express.static(staticpath))
// Create app listener
const server = app.listen(port)
// Create a log entry on start
let startlog = new Date().toISOString() + ' HTTP server started on port ' + port + '\n'
// Debug echo start log entry to STDOUT
if (args.debug) {
    console.info(startlog)
} 
// Log server start to file
fs.appendFileSync(path.join(logpath, 'server.log'), startlog)
// Exit gracefully and log
process.on('SIGINT', () => {
// Create a log entry on SIGINT
    let stoppinglog =  new Date().toISOString() + ' SIGINT signal received: stopping HTTP server\n'
//  Log SIGINT to file
    fs.appendFileSync(path.join(logpath, 'server.log'), stoppinglog)
// Debug echo SIGINT log entry to STDOUT
    if (args.debug) {
        console.info('\n' + stoppinglog)
    }
// Create a log entry on stop
    server.close(() => {
        let stoppedlog = new Date().toISOString() + ' HTTP server stopped\n'
// Log server stop to file
        fs.appendFileSync(path.join(logpath, 'server.log'), stoppedlog)
// Debug echo stop log entry to STDOUT
        if (args.debug) {
            console.info('\n' + stoppedlog)
        }    
    })
})
/*
import { rps, rpsls } from './controllers/a03-jmsabrwnng/lib/rpsls.js';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware to set the appropriate headers for all responses
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// Default API endpoint that returns 404 NOT FOUND for any undefined endpoints
app.use((req, res, next) => {
  res.status(404).send('404 Not Found');
});

// Endpoint /app/ that returns 200 OK
app.get('/app/', (req, res,next) => {
  res.status(200).send('200 OK');
});

// Endpoint /app/rps/
app.get('/app/rps/', (req, res) => {
  const result = rps();
  res.status(200).json(result);
});

// Endpoint /app/rpsls/
app.get('/app/rpsls/', (req, res) => {
  const result = rpsls();
  res.status(200).json(result);
});

// Endpoint /app/rps/play/ that accepts shot=(rock|paper|scissors) (URLEncoded) or {"shot":"(rock|paper|scissors)"} (JSON) as request bodies
app.post('/app/rps/play/', (req, res) => {
  // Extract the shot from the request body
  const shot = req.body.shot || req.body;

  // Determine the result
  const result = rps(shot);

  // Return the response
  res.status(200).json(result);
});

// Endpoint /app/rpsls/play/ that accepts shot=(rock|paper|scissors|lizard|Spock) (URLEncoded) or {"shot":"(rock|paper|scissors|lizard|Spock)"} (JSON) as request bodies
app.post('/app/rpsls/play/', (req, res) => {
  // Extract the shot from the request body
  const shot = req.body.shot || req.body;

  // Determine the result
  const result = rpsls(shot);

  // Return the response
  res.status(200).json(result);
});

// Endpoint /app/rps/play/(rock|paper|scissors)/
app.get('/app/rps/play/:shot', (req, res) => {
  const result = rps(req.params.shot);
  res.json(result);
});

// Endpoint /app/rpsls/play/(rock|paper|scissors|lizard|spock)/
app.post('/app/rpsls/play/:shot', (req, res) => {
  const result = rpsls(req.params.shot);
  res.json(result);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})*/;
