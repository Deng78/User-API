const express = require('express');
const db = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const config = require('./config')
const User = require('./schema.js');


const app = express();
const userRoutes = require('./routes/user');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', userRoutes);

// Connect to DB
db.connect(config.database, (err, db) => {if(err){ throw err }})
db.connection.on('connected', () => console.log(`Database Connected`))
db.connection.on('error', (err) => console.log(`Error: ${err}`))

// e.g. protected route
app.get('/user', verifyToken, (req,res) =>{
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