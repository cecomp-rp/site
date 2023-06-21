const express                                 = require("express")
const passport                                = require('passport')
const logged                                  = require("../../middleware/logged")
const { sanitizeInput }                       = require("../../utils/other/sanitizeInput.js")
const logout                                  = require("../../utils/auth/logout.js")
const { deleteOneSession, deleteAllSessions } = require("../../utils/auth/deleteSession")
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

//GET Sessions
router.get("/api/session", logged(['basic_functions']), async (req, res) => {
  const sessions = req.user.sessions
  res.status(200).json(sessions)
})

//Remove One Session
router.delete("/api/session/:id", logged(['basic_functions']), async (req, res) => {
  const codeRes = await deleteOneSession(req)
  res.status(codeRes.status).send()
})

//Remove All Sessions
router.delete("/api/session/all", logged(['basic_functions']), async (req, res) => {
  const codeRes = await deleteAllSessions(req) 
  res.status(codeRes.status).send()
})

  
//----------------Google-----------------------

router.get('/auth/google', 
  passport.authenticate('google', { scope: ['profile','email']
}))

router.get('/auth/google/redirect', 
  passport.authenticate('google', { failureRedirect: '/logout' }), 
  logged(['basic_functions']),
  function(req, res) {

    res.redirect(sanitizeInput(req.session.redirect));
    req.session.redirect = "/"
});

//--------------------------------------------

module.exports = router
