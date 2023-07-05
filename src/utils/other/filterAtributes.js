function filterAtributes(obj, atributes){
    let newObj = {};

    for (let key in obj) {
        if (atributes.includes(key)) {
            newObj[key] = obj[key];
        }
    }

    return newObj;
}

module.exports = filterAtributes;