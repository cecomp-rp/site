const User  = require("../../database/models/User")
const fs    = require('fs');

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
    var isBccMember = false;
    var lines = [];

    //Read lines from document
    const data = await fs.readFileSync('static/etc/bcc_members.txt', 'utf8');
    lines = data.split('\n');

    //Verify if email is in the list
    lines.forEach(line => {
        if(line == email){isBccMember = true}
    })

    //Add role to user
    if(isBccMember){
        const userDb = await User.findOne({email})
        var alreadyMember = false;

        userDb.roles.forEach(role => {
            if(role == 'bcc_member'){alreadyMember = true}
        });

        if(!alreadyMember){
            const new_roles = userDb.roles.concat('bcc_member');
            await User.updateOne({email}, {roles: new_roles});
        }
    }

    return isBccMember
}

module.exports = {verifyUspMember, verifyBccMember};