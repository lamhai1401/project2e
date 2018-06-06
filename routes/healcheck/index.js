const express = require('express');
const router = express.Router();

router.all('/', (req, res, next) => {
    res.send('OK')
});

module.exports = router;