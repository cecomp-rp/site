function common_date_unixToISO(date){
    return new Date(date).toISOString();
}

function common_date_ISOToUnix(date){
    return new Date(date).getTime();
}

function common_URL_get_last_param(){
    let url = window.location.href
    let url_array = url.split("/")
    let last_param = url_array[url_array.length - 1]
    return last_param
}