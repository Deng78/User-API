const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const salt = 10;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
      },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
});
UserSchema.pre('save', function(next){
    const user = this;
    bcrypt.hash(user.password, salt, (err, hash) =>{
        if(err){
            next(err);
        }
        user.password = hash;
        next();
    })
})

UserSchema.statics.authenticate = function(username, password, callback){
    User.findOne({username: username})
    .exec(function(err, user){
        if(err){
            return callback(err);
        } else if(!user){
            const err = {
                Error:'User Not Found',
                status: 401
            }
            return callback(err);
        }
        bcrypt.compare(password, user.password, (err, result) =>{
            if(result === true){
                return callback(null, user)
            }else{
                const err = {
                    Error:'Wrong Password',
                    status: 401
                }
                return callback(err);
            }
        })
    })
}
const User = mongoose.model('User', UserSchema);

module.exports = User;