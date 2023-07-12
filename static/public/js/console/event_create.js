var desc_event_create_editor, cert_event_create_editor, email_subscribe_event_create_editor, email_unsubscribe_event_create_editor, email_update_event_create_editor, email_atv_subscribe_event_create_editor;

$('document').ready(function(){

    desc_event_create_editor                = common_quill_createEditor('#event_create_description');
    cert_event_create_editor                = common_quill_createEditor('#event_create_custom_certificate');
    email_subscribe_event_create_editor     = common_quill_createEditor('#event_create_custom_email_event_subscribe');
    email_unsubscribe_event_create_editor   = common_quill_createEditor('#event_create_custom_email_event_unsubscribe');
    email_update_event_create_editor        = common_quill_createEditor('#event_create_custom_email_event_update');
    email_atv_subscribe_event_create_editor = common_quill_createEditor('#event_create_custom_email_atv_subscribe');

    $("#event_create_submit").click(function(){
        event_create_submit();
    });
    
});

function event_create_submit(){

    var name            = $("#event_create_name").val();
    var description     = common_quill_getContent(desc_event_create_editor);
    var startDate       = $("#event_create_start_date").val();
    var endDate         = $("#event_create_end_date").val();
    var roleRestriction = $("#event_create_role_restriction").val();

    if(roleRestriction == ""){ roleRestriction = null; }

    var activities = [];

    $('#event_create_activity_div').children().each(function () {

        var id              = $(this).attr('id');
        var title           = $(`#${id}_title`).val();
        var description     = $(`#${id}_description`).val();
        var startDate_ev    = $(`#${id}_date`).val();
        var duration        = $(`#${id}_duration`).val();

        activities.push({
            title,
            description,
            startDate: common_date_ISOToUnix(startDate_ev),
            duration
        })

    });

    var emails = [];

    if($("#event_create_custom_email_event_subscribe").is(":visible")){
        emails.push({
            type: "event_subscribe",
            content: common_quill_getContent(email_subscribe_event_create_editor)
        });
    }

    if($("#event_create_custom_email_event_unsubscribe").is(":visible")){
        emails.push({
            type: "event_unsubscribe",
            content: common_quill_getContent(email_unsubscribe_event_create_editor)
        });
    }

    if($("#event_create_custom_email_event_update").is(":visible")){
        emails.push({
            type: "event_update",
            content: common_quill_getContent(email_update_event_create_editor)
        });
    }

    if($("#event_create_custom_email_atv_subscribe").is(":visible")){
        emails.push({
            type: "atv_subscribe",
            content: common_quill_getContent(email_atv_subscribe_event_create_editor)
        });
    }

    var certificate = null;

    if($("#event_create_custom_certificate").is(":visible")){
        certificate = common_quill_getContent(cert_event_create_editor);
    }

    var data = {
        name,
        description,
        startDate: common_date_ISOToUnix(startDate),
        endDate: common_date_ISOToUnix(endDate),
        activities,
        emails,
        certificate,
        roleRestriction
    }

    common_fetch('/api/events', 'POST', data, ['event_create_message'])

}

function event_create_activity_add(){
    var uniq = 'id' + (new Date()).getTime() + parseInt(Math.random() * 1000);

    common_append('#event_create_activity_div', 'con_event_atv.html', {uniq});
}

function event_create_activity_remove(id){
    $('#' + id).remove();
}

//Really specific functions
function event_create_custom_certificate_add(){ //Custom certificate
    $("#event_create_custom_certificate").show();
    $("#event_create_custom_certificate_add").hide();
    $("#event_create_custom_certificate_remove").show();
}

function event_create_custom_certificate_remove(){
    $("#event_create_custom_certificate").hide();
    $("#event_create_custom_certificate_add").show();
    $("#event_create_custom_certificate_remove").hide();
}

function event_create_custom_email_event_subscribe_add(){ //Custom email event subscribe
    $("#event_create_custom_email_event_subscribe").show();
    $("#event_create_custom_email_event_subscribe_add").hide();
    $("#event_create_custom_email_event_subscribe_remove").show();
}

function event_create_custom_email_event_subscribe_remove(){
    $("#event_create_custom_email_event_subscribe").hide();
    $("#event_create_custom_email_event_subscribe_add").show();
    $("#event_create_custom_email_event_subscribe_remove").hide();
}

function event_create_custom_email_event_unsubscribe_add(){ //Custom email event unsubscribe
    $("#event_create_custom_email_event_unsubscribe").show();
    $("#event_create_custom_email_event_unsubscribe_add").hide();
    $("#event_create_custom_email_event_unsubscribe_remove").show();
}

function event_create_custom_email_event_unsubscribe_remove(){
    $("#event_create_custom_email_event_unsubscribe").hide();
    $("#event_create_custom_email_event_unsubscribe_add").show();
    $("#event_create_custom_email_event_unsubscribe_remove").hide();    
}

function event_create_custom_email_event_update_add(){ //Custom email event update
    $("#event_create_custom_email_event_update").show();
    $("#event_create_custom_email_event_update_add").hide();
    $("#event_create_custom_email_event_update_remove").show();
}

function event_create_custom_email_event_update_remove(){
    $("#event_create_custom_email_event_update").hide();
    $("#event_create_custom_email_event_update_add").show();
    $("#event_create_custom_email_event_update_remove").hide();
}

function event_create_custom_email_atv_subscribe_add(){ //Custom email activity subscribe
    $("#event_create_custom_email_atv_subscribe").show();
    $("#event_create_custom_email_atv_subscribe_add").hide();
    $("#event_create_custom_email_atv_subscribe_remove").show();
}

function event_create_custom_email_atv_subscribe_remove(){
    $("#event_create_custom_email_atv_subscribe").hide();
    $("#event_create_custom_email_atv_subscribe_add").show();
    $("#event_create_custom_email_atv_subscribe_remove").hide();
}

