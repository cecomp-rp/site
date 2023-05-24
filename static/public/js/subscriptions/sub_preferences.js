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

    fetch('/api/sub/preferences/' + event_name, {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }

    }).then(function(response) {

        response.json().then(function(data) {

            if(data.preferences.enable_email_notifications){
                $('#sub_enable_email_notifications').attr('checked', 'true');
            }
            if(data.preferences.enable_email_sharing){
                $('#sub_enable_email_sharing').attr('checked', 'true');
            }

        }).catch(function(err) {
                
            console.log(err);
    
        });

    });

}

function sub_preferences_update(event_name){

    fetch('/api/sub/preferences/' + event_name, {

        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            preferences:{
                            enable_email_notifications: $('#sub_enable_email_notifications').is(':checked'),
                            enable_email_sharing: $('#sub_enable_email_sharing').is(':checked')
                        }
        })

    }).then(function(response) {

        if(response.status == 200){
            $('#sub_preferences_message').text('Preferences updated successfully.');
        }else{
            $('#sub_preferences_message').text('Error updating preferences.');
        }

    });






}

function get_last_param_from_URL(){
    let url = window.location.href
    let url_array = url.split("/")
    let last_param = url_array[url_array.length - 1]
    return last_param
}

