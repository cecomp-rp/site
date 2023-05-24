$('document').ready(function(){

    const last_param = common_URL_get_last_param()

    $("#sub_subscribe").attr("href", "/sub/" + last_param);
    $("#sub_unsubscribe").attr("href", "/unsub/" + last_param);

    isSubscribed().then((subscribed) => {
        if(subscribed){
            $("#sub_subscribe").hide();
            $("#sub_unsubscribe").show();
        }else{
            $("#sub_subscribe").show();
            $("#sub_unsubscribe").hide();
        }

    })

    isOver().then((over) => {
        if(over){
            $("#sub_subscribe").hide();
            $("#sub_unsubscribe").hide();
            $("#sub_warning").text("This event is over.");
        }
    })

});

function isSubscribed(){

    return fetch("/api/sub/verify/" + common_URL_get_last_param(), {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    }).then((res) => {

        if(res.status == 200){
            return res.json()
        }else{
            return false
        }

    }).then((data) => {

        return data.subscribed;

    }).catch((err) => {
        console.log(err);
        return false;
    })

}

function isOver(){

    //Verify if event is over
    return fetch("/api/events/by_name/" + common_URL_get_last_param(), {

        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },

    }).then((res) => {

        if(res.status == 200){
            return res.json()
        }else{
            return false
        }

    }).then((data) => {

        if(data){
            if(common_date_ISOToUnix(data.endDate) < Date.now()){return true;}
        }

    }).catch((err) => {
        console.log(err);
        return false;
    })

}


