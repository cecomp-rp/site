function filterObject(obj, atributes, rename = {}){
    let newObj = {};

    for (let key in obj) {
        if (atributes.includes(key)) {
            newObj[key] = obj[key];
        }
    }

    for (let key in rename) {
        if (newObj[key]) {
            newObj[rename[key]] = newObj[key];
            delete newObj[key];
        }
    }

    return newObj;
}


module.exports = filterObject;