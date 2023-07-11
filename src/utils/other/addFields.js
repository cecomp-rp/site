function addFields(body, user){

    //Test expression ~email
    const regex = /~email/gi;
    body = body.replace(regex, user.email);

    //Test expression ~name
    const regex2 = /~name/gi;
    body = body.replace(regex2, user.name);

    return body;
}

module.exports = addFields;