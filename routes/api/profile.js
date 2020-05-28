const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const passport = require('passport');
const mongoose = require('mongoose');

//Access profile
router.get('/',passport.authenticate('jwt',{ session: false }),(req,res)=>{
    Profile.findOne({user: req.user.id})
        .then(profile=>{
            if(!profile){
                return res.status(404).json({success: false, errormessage: "Profile not found"})
            }
            res.json(profile);
        })
        .catch(e=>console.log(e));
})

//Update or create profile
router.post('/',passport.authenticate('jwt',{ session: false }),(req,res)=>{
   const profileValues={} //object to save all the data from the form 
   profileValues.user = req.user.id;
   if(req.body.username) profileValues.username = req.body.username
   if(req.body.country) profileValues.country = req.body.country
   if(req.body.portfolio) profileValues.portfolio = req.body.portfolio
   if(req.body.website) profileValues.website = req.body.website
   if(req.body.repository) profileValues.repository = req.body.repository
   if(typeof req.body.programmingLanguages!== undefined){
       profileValues.programmingLanguages=req.body.programmingLanguages.split(',');
   }
   profileValues.social={}
   if(req.body.youtube) profileValues.social.youtube = req.body.youtube
   if(req.body.instagram) profileValues.social.instagram = req.body.instagram
   if(req.body.linkedin) profileValues.social.linkedin = req.body.linkedin

   
   Profile.findOne({user: req.user.id})
    .then(profile=>{
        if(profile){
            //profile exists so update
            Profile.findOneAndUpdate({user:req.user.id},{$set: profileValues})
                .then(profile=>res.json({profile}))
                .catch(e=>console.log("problem while update "+e))
        }
        else{
            //profile doesn't exists so save new
            Profile.findOne({username: profileValues.username})
                .then(profile=>{
                    if(profile){
                        res.status(400).json({success: false,errormessage: "Username already exists"})
                    }
                    else{
                        new Profile(profileValues)
                            .save()
                            .then(profile=>res.json({profile}))
                            .catch(e=>console.log("problem while saving to db "+e))
                    }
                })
                .catch(e=>console.log("problem while creating new user "+e))
        }
    })
    .catch(e=>console.log("problem while fetching user "+e))
})

//find using username
router.get('/:username',(req,res)=>{
    Profile.findOne({username: req.params.username})
        .populate('user',['name','profilepic'])
        .then(profile=>{
            if(!profile){
                res.status(400).json({success: false,errormessage: "Username doesn't exists"})
            }
            else{
                res.json(profile)
            }
        })
        .catch(e=>console.log("Unable to find username "+e))
})

//find all users
router.get('/find/allusers',(req,res)=>{
    Profile.find()
        .populate('user',['name','profilepic'])
        .then(profiles=>{
            if(!profiles){
                res.status(400).json({success: false,errormessage: "0 Users"})
            }
            else{
                res.json(profiles)
            }
        })
        .catch(e=>console.log("Unable to find users "+e))
})

//delete user
router.delete('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user: req.user.id})
    Profile.findOneAndRemove({user: req.user.id})
        .then(()=>{
            User.findOneAndRemove({_id: req.user.id})
                .then(res.json({success: true, message: "Deleted Successfully"}))
                .catch(e=>console.log(e))
        })
        .catch(e=>console.log(e))
})

//add workrole
router.post('/workrole',passport.authenticate('jwt',{session: false}),(req,res)=>{
    const newWorkrole = {}
    if(req.body.role) newWorkrole.role = req.body.role
    if(req.body.company) newWorkrole.company = req.body.company
    if(req.body.country) newWorkrole.country = req.body.country
    if(req.body.from) newWorkrole.role = req.body.from
    if(req.body.to) newWorkrole.to = req.body.to
    if(req.body.current) newWorkrole.current = req.body.current
    if(req.body.details) newWorkrole.details = req.body.details

    Profile.findOne({user: req.user.id})
        .then(profile=>{
            if(!profile){
                res.json({success: false,errormessage: "Profile doesn't exists"})
            }
            else{
                profile.workrole.push(newWorkrole)
                profile.save()
                    .then(profile=>res.json({profile}))
                    .catch(e=>console.log(e))
            }
        })
        .catch(e=>console.log(e))
})

//delete workrole
router.delete('/workrole/:wid',passport.authenticate('jwt',{session: false}),(req,res)=>{
        Profile.findOne({user: req.user.id})
        .then(profile=>{
            if(!profile){
                res.json({success: false,errormessage: "Profile doesn't exists"})
            }
            else{
                const removeIndex = profile.workrole.map(item=>item.id).indexOf(req.params.wid);
                profile.workrole.splice(removeIndex,1)
                if(removeIndex==-1){
                    return res.json({success: false,errormessage: "Workrole doesn't exists"})
                }
                profile.save()
                    .then(profile=>res.json({profile}))
                    .catch(e=>console.log(e))
            }
        })
        .catch(e=>console.log(e))
})


module.exports = router;