const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../schema.js');
const config = require('../config')

const router = express.Router();

//
router.get('/user', (req, res) =>{})

// Signup Route
router.post('/user', (req, res) =>{
    res.setHeader('Content-Type', 'application/json');
    if( req.body.username && req.body.email && req.body.password ){
        const userData = {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
        }
        // Insert data to user
        User.create(userData, function (err, user) {
          if (err) {
            if (err.code === 11000) {
              // Duplicate username
              return res.status(403).send({MSG: 'User Already Exist!'});
            }          
            return res.status(500).send(err);
          } else {
              res.status(201).send({Error: 'User Created Successfully'})
          }
        });
    }else{
        res.send({Error: 'Invalid Request'})
    }
})

//
router.put('/user', (req, res) =>{})
// 
router.patch('/user', (req, res) =>{})

// Login Route
router.post('/user/login', (req, res) =>{ 
    if( req.body.username && req.body.email && req.body.password ){
        const userData = {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
        }
        User.authenticate(userData.username, userData.password, (err, user) =>{
            if(err){
                res.status(err.status).json(err)
            };
            jwt.sign({user}, config.secret, (err, token) =>{
                res.json({token})
            })
        })
    }
})

module.exports = router;