const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const Question = require('../../models/Question')
const User = require('../../models/User');

//get all questions
router.get('/',(req,res)=>{
    Question.find().then(questions=>{
        res.json(questions)
    })
    .catch(e=>console.log(e))
})

//posting questions
router.post('/',passport.authenticate('jwt',{session: false}),(req,res)=>{
    const newQuestion = new Question({
        questiontext: req.body.questiontext,
        questionCode: req.body.questionCode,
        user: req.user.id
    })
    newQuestion.save()
        .then(question=>{
            res.json(question.populate('user',['username','name']))
        })
        .catch(e=>console.log(e))
})

//get all questions of a user
router.get('/:uid',(req,res)=>{
    
    Question.find().then(questions=>{
        const listOfQuestions = questions.map(item=>{
            if(item.user == req.params.uid){
                return item
            }
        })
        res.send(listOfQuestions)
    })

})

//get searched question
router.get('/search/:qid',(req,res)=>{
    
    Question.find().then(questions=>{
        const listOfQuestions = questions.map(item=>{
            if(item._id == req.params.qid){
                return item
            }
        })
        res.send(listOfQuestions)
    })

})

//posting awnser
router.post('/awnser/:qid',passport.authenticate('jwt',{session: false}),(req,res)=>{
    Question.findById({_id: req.params.qid})
        .then(question=>{
            const newAwnser= {
                user: req.user.id
            }
            newAwnser.solution={}
            newAwnser.solution.text = req.body.text
            question.awnsers.push(newAwnser)
            question.save()
                .then(question=>{
                    res.json(question.populate('user',['username','name']))
                })
                .catch(e=>console.log(e))
         })
        .catch(e=>console.log(e))

    
})

//post upvote to any awnser
router.post('/upvote/:qid/:aid',passport.authenticate('jwt',{session: false}),(req,res)=>{
    Question.findById({_id: req.params.qid})
        .then(question=>{
            const index = question.awnsers.map(item=>item.id).indexOf(req.params.aid);
            if(index<0){
                return res.json({success: false, errormessage:"awnser not found"})
            }
            if(question.awnsers[index].solution.upvotes.filter(upvote=> upvote.user.toString() === req.user.id.toString()).length>0){
                return res.json({success: false, errormessage:"Already upvoted"})
            }
            question.awnsers[index].solution.upvotes.push({user: req.user.id})
            question.save()
                .then(question=>{
                    res.json(question.populate('user',['username','name']))
                })
                .catch(e=>console.log(e))
         })
        .catch(e=>console.log(e))    
})

//delete awnser
router.delete('/awnser/:qid/:aid',passport.authenticate('jwt',{session: false}),(req,res)=>{
    Question.findOneAndDelete({_id: req.params.qid})
        .then(question=>{
            const index = question.awnsers.map(item=>item.id).indexOf(req.params.aid);
            if(index<0){
                return res.json({success: false, errormessage:"awnser not found"})
            }
            res.json(question.awnsers[index])
            question.awnsers.splice(index,1)
            question.save()
                .then(question=>{
                    res.json(question.populate('user',['username','name']))
                })
                .catch(e=>console.log(e))
         })
        .catch(e=>console.log(e))    
})

//delete question
router.delete('/search/:qid',passport.authenticate('jwt',{session: false}),(req,res)=>{
    Question.findOneAndDelete({_id: req.params.qid})
    .then(res.json({success: true, message: "Deleted Successfully"}))
    .catch(e=>console.log(e))
})

module.exports = router;