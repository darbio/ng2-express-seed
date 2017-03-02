/*
 * A worker which will consume a redis message queue and then send the message
 * as an email using postmark
 */

'use strict'

import { Config } from '../../shared/config';
import { DomainEvent, SendEmailDomainEvent } from '../../shared/domainEvents';

var NRP = require('node-redis-pubsub');

export class EmailWorker {

  nrp: any;

  constructor() {
    let config = new Config();

    this.nrp = new NRP({
      url: config.redis_url
    });
  }

  start() {
    console.log("Listening for '" + SendEmailDomainEvent.eventId + "' on NRP");

    this.nrp.on(SendEmailDomainEvent.eventId, function (email) {
      console.log(email);
    });
  }

  stop() {
    this.nrp.quit();
  }

}

var worker = new EmailWorker();
worker.start();
