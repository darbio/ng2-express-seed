'use strict';

import * as express from 'express';
import { Config } from '../../../../shared/config';

const router = express.Router();

/* GET index page. */
router.get('/', (req, res, next) => {
  let config: Config = new Config();
  res.json({
    client_id : config.client_id,
    oidc_server_url : config.oidc_server_url
  });
});

export default router;
