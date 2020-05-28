const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const auth = require('./routes/api/auth');
const profile = require('./routes/api/profile');
const questions = require('./routes/api/questions');
const app = express();
const passport = require('passport');

//bodyparser middleware
app.use(bodyparser.urlencoded({'extended':false}));
app.use(bodyparser.json());

//DB instance
const db = require('./setup/myurl').USER;

//Mongodb Connect
mongoose.connect(db).then(()=>console.log("Connected to DB")).catch(err => console.log(err));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());
// //configuration for JWTStrategy
require("./strategies/JWTStrategy")(passport)

//testing route
app.get('/',(req,res)=>{
    res.send("Welcome to Satck Project");
})

//set routes to api
app.use('/api/auth',auth);
app.use('/api/profile',profile);
app.use('/api/questions',questions);

port=process.env.PORT||3000;

app.listen(port,()=>{
    console.log(`Port ${port} is running`);
})