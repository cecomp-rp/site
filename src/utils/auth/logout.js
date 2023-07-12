const User              = require("../../database/models/User")
const prettyPrint       = require("../../utils/other/prettyPrint")

async function logout(req){
    const token = req.user.token

    try{
      req.user.tokens = req.user.tokens.filter((tokenFound)=>{
          return token !== tokenFound.token
      })
      await User.updateOne({_id: req.user._id}, req.user)
    }catch(e){
        return {status: 400, redirect: '/login'}
    }

    prettyPrint("Auth", `User ${req.user.nick} logged out.`, "info")

    req.session = null
    req.logout()

    return {status: 200, redirect: '/'}
}

module.exports = logout