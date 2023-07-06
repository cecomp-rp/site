function filterObject(obj, atributes, rename = {}) {

    //Is it array?
    if (obj instanceof Array) {
        let newObjs = [];
        obj.forEach((obj) => {
            newObjs.push(filterObject_aux(obj, atributes, rename));
        });
        return newObjs;
    }

    return filterObject_aux(obj, atributes, rename);

}

function filterObject_aux(obj, atributes, rename = {}){
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