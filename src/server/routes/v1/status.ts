'use strict';

import * as express from 'express';
const router = express.Router();

/* GET index page. */
router.get('/', (req, res, next) => {
  res.json({
    date : new Date(),
    healthy : true,
    user : req.user
  })
});

export default router;
