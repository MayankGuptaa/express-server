const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const db = "mongodb://mayank:Mayank01232@ds113375.mlab.com:13375/databasetest"


mongoose.connect(db, { useNewUrlParser: true }, err => {
    if (err) {
        console.error(`Errror! ${err}`)
    } else {
        console.log('Connected to mongodb')
    }
});

function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
        return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' '[1])
    if (token === 'null'){
        return res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token, 'secretkey')
    if(!payload){
        return res.status(401).send('Unauthrized request')
    }
    req.userId = payload.subject;
    next();
}

router.get('/', (req, res) => {
    res.send('From API route')
});

router.post('/register', (req, res) => {
    let userData = req.body;
    let user = new User(userData);
    user.save((error, registeredUser) => {
        if(error) {
            console.log(error);
        } else {
            const payload = { subject: registeredUser._id };
            const token = jwt.sign(payload, 'secretKey');
            res.status(200).send({token});
        }
    });
})

router.post('/login', (req, res) =>{
    let userData = req.body;
    User.findOne({email: userData.email}, (error, user) => {
        if (error) {
            console.log(error);
        } else if (!user) {
            res.status(401).send('Invalid Email')
        } else if (user.password !== userData.password) {
            res.status(401).send('Invalid Password')
        } else {
            const payload = { subject: user._id };
            const token = jwt.sign(payload, 'secretKey');
            res.status(200).send({token});
        }
        
    })
})

router.get('/events', verifyToken, (req, res) => {
    let event = [
        {
            "id" : "1",
            "name" : "Mayank",
            "lastName" : "Gupta"
        },
        {
            "id" : "2",
            "name" : "Ayushi",
            "lastName" : "Maheshwari"
        }
    ]
    res.json(event);
})

router.get('/events2', (req, res) => {
    let event = [
        {
            "id" : "1",
            "name" : "Mayank",
            "lastName" : "Gupta"
        },
        {
            "id" : "2",
            "name" : "Ayushi",
            "lastName" : "Maheshwari"
        }
    ]
    res.json(event);
})

module.exports = router;