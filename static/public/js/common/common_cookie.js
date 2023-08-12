$(document).ready(function () {
    common_cookieWarning_verify()
});

function common_cookieWarning_verify() {
    
    //Verify if cookieWarning is set
    if (document.cookie.indexOf("cookieWarning") >= 0) {
        
        //Get cookie warning value
        const cookieWarningId = common_cookie_get('cookieWarning')
        
        //Fetch and display warning
        common_fetch_warning_aux(cookieWarningId)

        //Destroy cookie
        common_cookie_destroy('cookieWarning')
    }

}

function common_cookie_save(name, value){
    
    //Is it already set?
    if (document.cookie.indexOf(name) >= 0) {
        //Destroy cookie
        common_cookie_destroy(name)
        return
    }
    
    document.cookie = name + "=" + value + "; path=/";
}

function common_cookie_destroy(name){
    
    //Is it already set?
    if (document.cookie.indexOf(name) >= 0) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

}

function common_cookie_get(name){
    var cookie = document.cookie.split(';')
    
    var your_cookie;
    for(var i = 0; i < cookie.length; i++){
        if(cookie[i].includes(name)){
            your_cookie = cookie[i].split('=')[1]
        }
    }

    if(your_cookie){

        //Decode URL
        your_cookie = decodeURIComponent(your_cookie)

        return your_cookie
    }
    
    return undefined;
}