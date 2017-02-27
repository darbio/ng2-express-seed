'use strict';
/**
 * Module dependencies.
*/

import app from '../app';
import * as http from 'http';

import * as cluster from 'cluster';
import * as os from 'os';

const port = normalizePort(process.env.PORT || 3000);

const numCPUs = os.cpus().length;
if (cluster.isMaster) {

    console.log('Master cluster setting up ' + numWorkers + ' workers...')

    cluster.on('online', worker => {
        console.log('Worker ' + worker.process.pid + ' is online')
    })

    cluster.on('exit', (worker, code, signal) => {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal)
        console.log('Starting a new worker')
        cluster.fork()
    })

    var numWorkers = this.numCPUs;

    for (var i = 0; i < numWorkers; i++) cluster.fork()

} else {
  /**
   * Get port from environment and store in Express.
   */

  app.set('port',port);

  /**
   * Create HTTP server.
   */

  var server = http.createServer(app);

  /**
   * Listen on provided port,on all network interfaces.
   */

  server.listen(port, onListening);
  server.on('error',onError);
}

/**
 * Normalize a port into a number,string,or false.
 */
function normalizePort(val : any): number|string|boolean {
  let port = parseInt(val,10);

  if(isNaN(port)){
    //name pipe
    return val;
  }

  if(port >= 0){
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall != 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  //handle specific listen errors with friendly messages
  switch(error.code) {
    case 'EACCES':
      console.error(bind + 'requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + 'is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
