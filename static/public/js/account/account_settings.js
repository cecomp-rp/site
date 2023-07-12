$('document').ready(function() {

    acc_settings_fetch();

    $('#account_settings_update').click(function() {
        acc_settings_update();
    });

    $('#account_enable_email_notifications_global').click(function() {
        acc_settings_update_layout();
    });

    $('#account_enable_email_sharing_global').click(function() {
        acc_settings_update_layout();
    });

});

function acc_settings_update_layout() {
    if(!$('#account_enable_email_notifications_global').is(':checked')) {
        $('#account_enable_email_notifications').attr('disabled', 'true');
    }else{
        $('#account_enable_email_notifications').removeAttr('disabled');
    }

    if(!$('#account_enable_email_sharing_global').is(':checked')) {
        $('#account_enable_email_sharing').attr('disabled', 'true');
    }else{
        $('#account_enable_email_sharing').removeAttr('disabled');
    }
}

function acc_settings_fetch() {

    common_fetch('/api/account/settings', 'GET').then((data) => {

        if(data){
            if(data.enable_email_notifications_global){
                $('#account_enable_email_notifications_global').attr('checked', 'true');
            }
            if(data.enable_email_sharing_global){
                $('#account_enable_email_sharing_global').attr('checked', 'true');
            }
            if(data.enable_email_notifications){
                $('#account_enable_email_notifications').attr('checked', 'true');
            }
            if(data.enable_email_sharing){
                $('#account_enable_email_sharing').attr('checked', 'true');
            }

            acc_settings_update_layout();
        }

    })

}

function acc_settings_update() {

    var enable_email_notifications_global = $('#account_enable_email_notifications_global').is(':checked');
    var enable_email_sharing_global       = $('#account_enable_email_sharing_global').is(':checked');
    var enable_email_notifications    = $('#account_enable_email_notifications').is(':checked');
    var enable_email_sharing          = $('#account_enable_email_sharing').is(':checked');

    if(!enable_email_notifications_global){
        enable_email_notifications = false;
    }

    if(!enable_email_sharing_global){
        enable_email_sharing = false;
    }

    const data = {
        enable_email_notifications_global,
        enable_email_sharing_global,
        enable_email_notifications,
        enable_email_sharing
    }

    common_fetch('/api/account/settings', 'PATCH', data, ['account_settings_message'])

}