const express = require("express")
const route = express.Router()
const {ensureAuth, ensureGuest} = require('../middleware/Auth')

const Story = require('../models/Story')

//Login/Landing
//GET /
route.get('/',ensureGuest,(req,res)=>{
    res.render('login',{
        layout: 'login',
    }
    )
})

//Dashboard
// GET /dashboard
route.get('/dashboard',ensureAuth,async (req,res)=>{

    try{
        const stories = await Story.find({user: req.user.id}).lean()
        res.render('dashboard',{
            name:req.user.firstName,
            stories
        })
    }
    catch(err){
        console.error(err)
        res.render('/err')
    }

    
})

module.exports = route