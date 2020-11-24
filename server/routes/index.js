const { response } = require('express');
const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/users', async (req,res,next)=> {
    try {
        let results = await db.users.all();
        res.json(results);
    } catch(error) {
        console.log(error);
        response.sendStatus(500);
    }
})

router.get('/users/:id', async (req,res,next)=>{
    const id = req.params.id;
    try {
        let results =  await db.users.getUserById(id);
        res.json(results);
    } catch (error) {
        console.log(error);
        response.sendStatus(500);
    }
})

router.post('/users', (req,res) => {
    const params = req.body;
    // console.log(params);
    db.users.create(params).then((result)=>res.json(result)).catch(error=>{
        if (error.includes("phone")) res.json("Phone already in use")
        else res.json("Email already in use")
    });
})


module.exports = router;