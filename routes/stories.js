const express = require("express")
const route = express.Router()
const {ensureAuth} = require('../middleware/Auth')

const Story = require('../models/Story')

//Add Stories
//GET /stories/add
route.get('/add',ensureAuth,(req,res)=>{
    res.render('stories/add')
})

//Process the add form
//POST /stories
route.post('/',ensureAuth,async (req,res)=>{

    try{
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    }catch(err){
        app.render('error/500')
    }

})

//Show all stories
//GET /stories
route.get('/',ensureAuth,async(req,res)=>{
    try{
        const stories = await Story.find({status: 'public'})
        .populate('user')
        .sort({createdAt: "desc"})
        .lean()

        res.render('stories/index',{
            stories,
        })
    }catch(err){
        console.log(err);
        res.render('error/500')
    }
})

//Show Single Story
//GET /stories/:id
route.get('/:id',ensureAuth,async (req,res)=>{
    try{
        let story = await Story.findById(req.params.id).populate('user').lean()

        if(!story){
            return res.render('error/5000')
        }
       res.render('stories/show',{
        story
       }) 
    }catch(err){
        console.error(err)
        res.render('error/404')
    }
})

//Edit Post
//GET /stories/edit/:id
route.get('/edit/:id',ensureAuth,async (req,res)=>{

    try{
        const story = await Story.findOne({
            _id:req.params.id
        }).lean()
    
        if(!story){
            return res.render('error/404')
        }
    
        if(story.user != req.user.id){
            res.redirect('/stories')
        }else{
            res.render('stories/edit',{
                story,
            })
        }
    }catch(err){
        console.log(err)
        res.redirect('error/500')
    }
    
})


//Update story
//PYT /stories/:id
route.put('/:id',ensureAuth,async (req,res)=>{

    try{
        let story = await Story.findById(req.params.id).lean()

        if(!story){
            return res.render("error/404")

        }

        if(story.user != req.user.id){
            res.redirect('/stories')
        }else{
            story = await Story.findOneAndUpdate({_id:req.params.id},req.body,{
                new:true,
                runValidators:true
            })


            res.redirect('/dashboard')
    }
    }catch(err){
        console.log(err)
        res.redirect('error/500')
    }

    
})

//Delete Stories
//DELETE /stories/:id
route.delete('/:id',ensureAuth,async(req,res)=>{
   try{
    await Story.remove({_id: req.params.id})
    res.redirect('/dashboard')
   }catch(err){
        console.log(err)
        res.redirect('error/500')
   }
})

//User Stories
//GET /stories/user/:userId
route.get('/user/:userId',ensureAuth, async (req,res)=>{
    try{
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .lean()

        res.render('stories/index',{
            stories,
        })

    }catch(err){
        console.error(err);
        res.render('error/500')
    }
})
module.exports = route