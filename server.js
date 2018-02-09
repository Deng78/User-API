const express = require('express');
const db = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const config = require('./config')
const User = require('./schema.js');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to DB
db.connect(config.database, (err, db) =>{
    if(err){ 
        throw err
    }
})
db.connection.on('connected', () => console.log(`Database Connected`))
db.connection.on('error', (err) => console.log(`Error: ${err}`))

// Routes
app.post('/api/login', (req,res,next) =>{
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
app.post('/api/signup', (req,res) =>{
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
              res.send({MSG: 'User Created Successfully'})
          }
        });
    }
    
})
app.post('/user', verifyToken, (req,res) =>{
    jwt.verify(req.token, config.secret, (err, authData) =>{
        if(err){
            res.json(err)
        }else{
            res.json({
                MSG: 'posted successfully',
                authData
            })
        }
    })
})
function verifyToken(req,res,next){
    const bearerHeader = req.headers['authorization']
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        // Set token
        req.token = bearerToken;
        next();
    }else{
        // Forbidden
        res.sendStatus(403);
    }
}

app.listen(config.port, () => console.log(`Server running on port ${config.port}`))