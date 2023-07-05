const express                                 = require("express")
const passport                                = require('passport')
const logged                                  = require("../../middleware/logged")
const logout                                  = require("../../utils/auth/logout.js")
const User                                    = require("../../database/models/User")
require("../../utils/auth/passport")

const router = new express.Router()

//Login
//It's a page. So, in the PAGES router
//The other stuff here are endpoints ;)

//Logout
router.get("/logout", logged(['basic_functions']), async (req, res) => {
  const codeRes = await logout(req) 
  if(codeRes.redirect){
      res.redirect(codeRes.redirect)
  }
  res.status(codeRes.status).send()
})

//GET Sessions (by page)
router.get("/api/session/:page", logged(['basic_functions']), async (req, res) => {
  const page_size = 5;
  const page = parseInt(req.params.page)

  var sessions = req.user.tokens

  //filter sessions to remove token
  sessions.forEach((session) => {
      session.token = undefined
  })

  //Remove the current session (last one)
  const your_session = sessions.pop()

  //filter page size
  const start = (page - 1) * page_size
  const end = page * page_size
  other_sessions = sessions.slice(start, end)

  res.status(200).json({current: your_session, other: other_sessions})
})

//Remove One Session
router.delete("/api/session/by_id/:id", logged(['basic_functions']), async (req, res) => {
  const session_id = req.params.id

  //Remove the session
  await User.findByIdAndUpdate(req.user._id, {$pull: {tokens: {_id: session_id}}}).then((user) => {
      if(!user){return res.status(400).json()}
      res.status(200).send()
  }).catch((e) => {
      res.status(400).json()
  })

})

//Remove All Sessions
router.delete("/api/session/all", logged(['basic_functions']), async (req, res) => {

  //Remove all sessions
  await User.findByIdAndUpdate(req.user._id, {tokens: []}).then((user) => {
    if(!user){return res.status(400).json()}
      res.status(200).send()
  }).catch((e) => {
      res.status(400).json()
  })

})

  
//----------------Google-----------------------

router.get('/auth/google', 
  passport.authenticate('google', { scope: ['profile','email']
}))

router.get('/auth/google/redirect', 
  passport.authenticate('google', { failureRedirect: '/logout' }), 
  logged(['basic_functions']),
  function(req, res) {

    res.redirect(req.session.redirect);
    req.session.redirect = "/"
});

//--------------------------------------------

module.exports = router
