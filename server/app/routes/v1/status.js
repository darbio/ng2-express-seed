'use strict';
const express = require("express");
const router = express.Router();
router.get('/', (req, res, next) => {
    res.json({
        date: new Date(),
        healthy: true
    });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;
//# sourceMappingURL=status.js.map