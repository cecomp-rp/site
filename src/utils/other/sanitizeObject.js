const sanitizer         = require('sanitizer');
const createDOMPurify   = require('dompurify');
const { JSDOM }         = require('jsdom');

const window            = new JSDOM('').window;
const domp              = createDOMPurify(window);

function sanitizeInput(input1){
    var input2 = sanitizer.sanitize(input1);
    var output = domp.sanitize(input2);
    return output;
}

function sanitizeObject(data) {

    //If data is string
    if(typeof data === "string") {
        return sanitizeInput(data);
    }

    for (let key in data) {
        if(data.hasOwnProperty(key) && data[key]) {
            if(typeof data[key] === "object" && Array.isArray(data[key])) {
                data[key].forEach((item) => sanitizeObject(item));
            }else if(typeof data[key] === "object"){
                sanitizeInput(data[key]);
            }else{
                data[key] = sanitizeInput(data[key])
            }
        }
    }
    return data;
}

module.exports = sanitizeObject