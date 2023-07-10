$('document').ready(function() {

    acc_settings_fetch();

    $('#account_settings_update').click(function() {
        acc_settings_update();
    });

});

function acc_settings_fetch() {

    common_fetch('/api/account/settings', 'GET').then((data) => {

        if(data){
            if(data.enable_email_notifications){
                $('#account_enable_email_notifications').attr('checked', 'true');
            }
            if(data.enable_email_sharing){
                $('#account_enable_email_sharing').attr('checked', 'true');
            }
        }

    })

}

function acc_settings_update() {

    const enable_email_notifications    = $('#account_enable_email_notifications').is(':checked');
    const enable_email_sharing          = $('#account_enable_email_sharing').is(':checked');

    const data = {
        enable_email_notifications,
        enable_email_sharing
    }

    common_fetch('/api/account/settings', 'PATCH', data, ['account_settings_message'])

}