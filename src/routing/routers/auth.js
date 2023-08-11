const express                                 = require("express")
const passport                                = require('passport')
const logged                                  = require("../../middleware/logged")
const logout                                  = require("../../utils/auth/logout.js")
const User                                    = require("../../database/models/User")
const commonRes                               = require("../../utils/io/commonRes")
require("../../utils/auth/passport")

const router = new express.Router()

//Login
//It's a page. So, in the PAGES router
//The other stuff here are endpoints ;)

//Logout
router.get("/logout", logged(['basic_functions']), async (req, res) => {
  const codeRes = await logout(req) 
  if(codeRes.redirect){
    res.redirect(req.cookies.redirect || "/")
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

  commonRes(res, {
      error: undefined,
      message: undefined,
      content: {
          current: your_session,
          other: other_sessions
      }})

})

//Remove One Session
router.delete("/api/session/by_id/:id", logged(['basic_functions']), async (req, res) => {
  const session_id = req.params.id

  //Remove the session
  const user = await User.findByIdAndUpdate(req.user._id, {$pull: {tokens: {_id: session_id}}})
  .catch((e) => {})

  if(!user){
    commonRes(res, {
      error: "Error.",
      message: undefined,
      content: undefined
    })
  } else {
    commonRes(res, {
      error: undefined,
      message: "Success.",
      content: undefined
    })
  }
  
})

//Remove All Sessions
router.delete("/api/session/all", logged(['basic_functions']), async (req, res) => {

  //Remove all sessions
  const user = await User.findByIdAndUpdate(req.user._id, {tokens: []})
  .catch((e) => {})

  if(!user){
    commonRes(res, {
      error: "Error.",
      message: undefined,
      content: undefined
    })
  } else {
    commonRes(res, {
      error: undefined,
      message: "Success.",
      content: undefined
    })
  }

})

  
//----------------Google-----------------------

router.get('/auth/google', 
  passport.authenticate('google', { scope: ['profile','email']
}))

router.get('/auth/google/redirect', 
  passport.authenticate('google', { failureRedirect: '/logout' }), 
  logged(['basic_functions']),
  function(req, res) {

    res.redirect(req.cookies.redirect || "/");
});

//--------------------------------------------

module.exports = router
