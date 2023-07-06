$('document').ready(function(){

    const last_param = common_URL_get_last_param()
    $("#sub_subscribe").attr("href", "/sub/" + last_param);
    $("#sub_unsubscribe").attr("href", "/unsub/" + last_param);

    isSubscribed();
    isOver();

});

async function isSubscribed(last_param){

    return common_fetch("/api/sub/verify/" + common_URL_get_last_param(), "POST", {}, []).then((data) => {

        if(data){
            if(data.subscribed){
                $("#sub_subscribe").hide();
                $("#sub_unsubscribe").show();
            }else{
                $("#sub_subscribe").show();
                $("#sub_unsubscribe").hide();
            }

            return data.subscribed;
        }

    })

}

async function isOver(last_param){

    return common_fetch("/api/events/by_name/" + common_URL_get_last_param(), "GET", {}, []).then((data) => {

        if(data){
            if(common_date_ISOToUnix(data.endDate) < Date.now()){
                $("#sub_subscribe").hide();
                $("#sub_unsubscribe").hide();
                $("#sub_warning").text("This event is over.");
                return true;
            }

            return false;

        }

    })

}


