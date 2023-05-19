const User = require("../../database/models/User")

//Verify if it is a USP member
const verifyUspMember = async (email) => {
    const domain = email.split('@').at(-1)

    if(domain != 'usp.br'){ return false }

    const userDb = await User.findOne({email})

    var alreadyMember = false;
    userDb.roles.forEach(role => {
        if(role == 'usp_member'){alreadyMember = true}
    });
    if(alreadyMember){return true}

    const new_roles = userDb.roles.concat('usp_member');
    await User.updateOne({email}, {roles: new_roles});

    return true
}

//Verify if it is a BCC member
const verifyBccMember = async (email) => {
    return true
}

module.exports = {verifyUspMember};