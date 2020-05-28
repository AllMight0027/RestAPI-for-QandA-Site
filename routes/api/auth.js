const express = require('express');
const router = express.Router();
const key = require('../../setup/myurl').secret;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../../models/User');

//Test route
router.get('/',(req,res)=>{
    res.json({test:'Success'});
})

//register user
router.post('/register',(req,res)=>{
    User.findOne({email: req.body.email})
    .then(user=>{
        if(user){
            return res.status(400).json({sucess: false, errormessage:"User Already Exists"});
        }
        else{
            const newUser= new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                username: req.body.username
            });
            //encrypt password
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newUser.password, salt, function(err, hash) {
                    if(err) throw err;
                    else{
                        newUser.password=hash;
                        newUser.save()
                            .then(user=>res.json(user))
                            .catch(err=>console.log(err));
                    }
                });
            });
        }
    })
    .catch(err=>console.log(err));
})

//login user
router.post('/login',(req,res)=>{
    const email = req.body.email
    const password = req.body.password

    User.findOne({email})
        .then(user=>{
            if(!user){
                return res.status(404).json({sucess: false, errormessage: "Email id not found"})
            }

            bcrypt.compare(password,user.password)
                .then(isCorrect=>{
                    if(isCorrect){
                        //res.status(200).json(user)
                        //use payload to create a token for user
                        const payload={
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            profilepic: user.profilepic,
                            username: user.username
                        }
                        jwt.sign(
                            payload,
                            key,
                            { expiresIn: 3600 },
                            (err,token)=>{
                                if(err){
                                    res.json({sucess: false})
                                }
                                else{
                                    res.json(
                                        {
                                            sucess: true,
                                            token: "Bearer " + token                                        
                                        })
                                }
                            }
                            );
                    }
                    else{
                        return res.status(400).json({sucess: false, errormessage:"Wrong Password"});
                    }
                })
                .catch(e=>console.log(e))
        })
        .catch(e=>console.log(e))

});


router.get('/profile', passport.authenticate('jwt', { session: false }),
    function(req, res) {
        res.json({
            id: req.user.id,
            name: req.user.name,
            username: req.user.username,
            email: req.user.email,
            profilepic: req.user.profilepic
        })
    }
);

module.exports = router;