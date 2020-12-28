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
    if (params.validate) {
        // console.log(typeof db.users.validate);
        console.log(1111)
        db.users.validate(params.validate).then((result)=>{
            console.log(result)
            if (result.length == 0) {
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        }).catch(error=>res.sendStatus(500));
    } else {
        db.users.create(params).then((result)=>res.json(result)).catch(error=>{
            res.sendStatus(500);
        });
    }
})


module.exports = router;