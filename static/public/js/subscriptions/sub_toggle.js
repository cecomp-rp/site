

$('document').ready(function(){

    const last_param = common_URL_get_last_param()
    $("#sub_subscribe").attr("href", "/sub/" + last_param);
    $("#sub_unsubscribe").attr("href", "/unsub/" + last_param);


    isOver().then((is_over) => {

        if(!is_over){isSubscribed();}

    })

});

async function isSubscribed(){

    return common_fetch("/api/sub/verify/" + common_URL_get_last_param(), "POST", {}, []).then((data) => {

        if(data){

            isOver().then((is_over) => {

                if(!(is_over)){
                    if(data.subscribed){
                        $("#sub_subscribe").hide();
                        $("#sub_unsubscribe").show();
                    }else{
                        $("#sub_subscribe").show();
                        $("#sub_unsubscribe").hide();
                    }
                }

            })

            return data.subscribed;
        }

    })

}

async function isOver(){

    return common_fetch("/api/events/by_name/" + common_URL_get_last_param(), "GET", {}, []).then((data) => {

        if(data){
            if(data.endDate < Date.now()){
                $("#sub_warning").show();
                $("#sub_warning").text("Este evento chegou ao fim.");
                return true;
            }
            
            return false;
        }

    })

}

async function event_unsub(){
    common_loading_open();

    var href = $('#sub_unsubscribe').attr("href");
    location.href = href;

}

