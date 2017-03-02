/*
 * Publishes domain events to the NRP queue
*/

import { Config } from './config';
import { IDomainEvent } from './domainEvents';

var NRP = require('node-redis-pubsub');

export class Publisher {

  nrp: any;

  constructor() {
    let config = new Config();

    this.nrp = new NRP({
      url: config.redis_url
    });
  }

  publish (event: IDomainEvent) {
    this.nrp.emit(event.eventId, event);
  }

}
