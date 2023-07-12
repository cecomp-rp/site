const cookieWarning = require('./cookieWarning.js');

function commonRes(res, data) {

    //DATA FORMAT
    // {
    //     error: "",
    //     message: "",
    //     content: {},
    //     warning: "id",
    //     redirect: "url"
    //
    // }

    //Redirect set?
    if(data.redirect){

        //Warning set? > Set cookie warning
        if(data.warning){
            cookieWarning(res, data.warning);
            data.warning = undefined;
        }

    }
    
    //Data.content cannot be undefined if there is no error
    if(data.content == undefined){
        data.content = {};
    }

    //If error is defined, then it's an error
    if(data.error){
        data.content = undefined;
        data.message = undefined;
        return res.status(400).json(data);
    }

    //Else, it's a success
    data.error = undefined;
    return res.status(200).json(data);
}

module.exports = commonRes;