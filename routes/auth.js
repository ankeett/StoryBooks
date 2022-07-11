const express = require("express")
const passport = require("passport")
const route = express.Router()

//Auth with Google
//GET /auth/google
route.get('/google',passport.authenticate('google',{scope:['profile']}))

//Google auth callback
// GET /auth/google/callback
route.get('/google/callback',
passport.authenticate('google',{failureRedirect: '/'}),
(req,res)=>{
    res.redirect('/dashboard')
}
)

//Logout
// /auth/logout
route.get("/logout", (req, res) => {
    req.logout(req.user, err => {
      if(err) return next(err);
      res.redirect("/");
    });
});


module.exports = route