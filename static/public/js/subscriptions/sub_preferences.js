$('document').ready(function() {

    var event_name = get_last_param_from_URL();

    isSubscribed().then(function(result) {

        if(result){
            $('#sub_prefereces').show();
            sub_preferences_load(event_name);
        }
            
    })

    $('#sub_preferences_update').click(function() {     
        sub_preferences_update(event_name);
    });

});

function sub_preferences_load(event_name){

    common_fetch('/api/sub/preferences/' + event_name, 'POST').then((data) => {

        if(data){

            if(data.enable_email_notifications){
                $('#sub_enable_email_notifications').attr('checked', 'true');
            }
            if(data.enable_email_sharing){
                $('#sub_enable_email_sharing').attr('checked', 'true');
            }

        }

    });

}

function sub_preferences_update(event_name){

    var data = {
        enable_email_notifications: $('#sub_enable_email_notifications').is(':checked'),
        enable_email_sharing: $('#sub_enable_email_sharing').is(':checked')
    }

    common_fetch('/api/sub/preferences/' + event_name, 'PATCH', data, ['sub_preferences_message'])

}

function get_last_param_from_URL(){
    let url = window.location.href
    let url_array = url.split("/")
    let last_param = url_array[url_array.length - 1]
    return last_param
}

