const User              = require("../../database/models/User")

async function logout(req){
    const token = req.user.token

    try{
      req.user.tokens = req.user.tokens.filter((tokenFound)=>{
          return token !== tokenFound.token
      })
      await User.updateOne({_id: req.user._id}, req.user)
    }catch(e){
        console.log(e)
        return {status: 400, redirect: '/login'}
    }

    console.log('session', 'Logout: ', req.user.nick, '')
    req.session = null
    req.logout()

    return {status: 200, redirect: '/'}
}

module.exports = logout