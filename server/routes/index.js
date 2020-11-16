const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req,res,next)=> {
    res.json({test: 'test'})
})

module.exports = router;