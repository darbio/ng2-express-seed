'use strict';

import * as express from 'express';
import { Publisher } from '../../../shared/publisher';
import { SendEmailDomainEvent } from '../../../shared/domainEvents';

const router = express.Router();

/* GET index page. */
router.get('/', (req, res, next) => {
  res.json({
    date : new Date(),
    healthy : true,
    user : req.user
  })
});

router.get('/test', (req, res, next) => {
  var publisher = new Publisher();
  publisher.publish(new SendEmailDomainEvent("jamesdarbyshire@gmail.com"));

  res.json({});
});

export default router;
