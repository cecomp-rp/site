$(document).ready(function () {
    common_cookieWarning_verify()
});

function common_cookieWarning_verify() {
    
    //Verify if cookieWarning is set
    if (document.cookie.indexOf("cookieWarning") >= 0) {
        
        //Get cookie warning value
        const cookieWarningId = document.cookie.split('; ').find(row => row.startsWith('cookieWarning')).split('=')[1];
        
        //Fetch and display warning
        common_fetch_warning_aux(cookieWarningId)

        //Destroy cookie
        document.cookie = 'cookieWarning=; Max-Age=-99999999;';
    }

}