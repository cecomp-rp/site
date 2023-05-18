const User              = require("../../database/models/User")

async function deleteOneSession(req){
    const token = req.body.sessionToDelete

    try{
        req.user.tokens = req.user.tokens.filter((tokenFound)=>{
            return token !== tokenFound.token
        })
        await User.updateOne({_id: req.user._id}, req.user)
    }catch(e){return {status: 400}}

    console.log('session', 'Session destroyed: ', token, ' by ' + req.user.nick)
     
    return {status: 200}
}

async function deleteAllSessions(req){
    try{
        req.user.tokens = [];
        await User.updateOne({_id: req.user._id}, req.user)
    }catch(e){return {status: 400}}
     
    printToConsole('session', 'All sessions destroyed: ', req.user.nick, '')
    return {status: 200}
}

module.exports = {deleteAllSessions, deleteOneSession}