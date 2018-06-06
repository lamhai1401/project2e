const express = require('express');
const router = express.Router();

const healCheck = require('./healcheck');

router.use('/healcheck', healCheck);

module.exports = router;