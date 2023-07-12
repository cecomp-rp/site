var desc_event_edit_editor, cert_event_edit_editor, email_subscribe_event_edit_editor, email_unsubscribe_event_edit_editor, email_update_event_edit_editor, email_atv_subscribe_event_edit_editor;

$('document').ready(function(){

    desc_event_edit_editor                = common_quill_createEditor('#event_edit_description');
    cert_event_edit_editor                = common_quill_createEditor('#event_edit_custom_certificate');
    email_subscribe_event_edit_editor     = common_quill_createEditor('#event_edit_custom_email_event_subscribe');
    email_unsubscribe_event_edit_editor   = common_quill_createEditor('#event_edit_custom_email_event_unsubscribe');
    email_update_event_edit_editor        = common_quill_createEditor('#event_edit_custom_email_event_update');
    email_atv_subscribe_event_edit_editor = common_quill_createEditor('#event_edit_custom_email_atv_subscribe');

    //Fetch events by ID
    $("#event_edit_id").on('input', function(){
        var id = $("#event_edit_id").val();
        event_edit_fetch(id);
    });

    //Submit event
    $("#event_edit_submit").click(function(){
        var id = $("#event_edit_id").val();
        event_edit_submit(id);
    });

});

function event_edit_fetch(id){

    $("#event_edit_name").val("");
    common_quill_clearContent(desc_event_edit_editor);
    $("#event_edit_start_date").val("");
    $("#event_edit_end_date").val("");
    $("#event_edit_activity_div").empty();
    
    $("#event_edit_custom_certificate").hide();
    $("#event_edit_custom_certificate_add").show();
    $("#event_edit_custom_certificate_remove").hide();
    
    $("#event_edit_custom_email_event_subscribe").hide();
    $("#event_edit_custom_email_event_subscribe_add").show();
    $("#event_edit_custom_email_event_subscribe_remove").hide();
    
    $("#event_edit_custom_email_event_unsubscribe").hide();
    $("#event_edit_custom_email_event_unsubscribe_add").show();
    $("#event_edit_custom_email_event_unsubscribe_remove").hide();
    
    $("#event_edit_custom_email_event_update").hide();
    $("#event_edit_custom_email_event_update_add").show();
    $("#event_edit_custom_email_event_update_remove").hide();
    
    $("#event_edit_custom_email_atv_subscribe").hide();
    $("#event_edit_custom_email_atv_subscribe_add").show();
    $("#event_edit_custom_email_atv_subscribe_remove").hide();

    common_fetch('/api/events/by_id/' + id, 'GET', {}, []).then((data) => {

        if(data){

            if(data == null){ return; }//Necessário?

            $("#event_edit_name").val(data.title);
            common_quill_setContent(desc_event_edit_editor, data.description);

            $("#event_edit_start_date").val(common_date_unixToISO(data.startDate));
            $("#event_edit_end_date").val(common_date_unixToISO(data.endDate));

            data.activities.forEach((activity) => {

                var uniq = 'id' + (new Date()).getTime() + parseInt(Math.random() * 1000);
                  
                common_append('#event_edit_activity_div', 'con_event_atv.html', {uniq}).then(() => {

                    $(`#${uniq}_title`).val(activity.title);
                    $(`#${uniq}_description`).val(activity.description);
                    $(`#${uniq}_date`).val(common_date_unixToISO(activity.startDate));
                    $(`#${uniq}_duration`).val(activity.duration);

                })

            })

            if(data.emails){

                data.emails.forEach((email) => {

                    if(email.type == "event_subscribe"){
                        $("#event_edit_custom_email_event_subscribe").show();
                        $("#event_edit_custom_email_event_subscribe_add").hide();
                        $("#event_edit_custom_email_event_subscribe_remove").show();
                        common_quill_setContent(email_subscribe_event_edit_editor, email.content);
                    }

                    if(email.type == "event_unsubscribe"){
                        $("#event_edit_custom_email_event_unsubscribe").show();
                        $("#event_edit_custom_email_event_unsubscribe_add").hide();
                        $("#event_edit_custom_email_event_unsubscribe_remove").show();
                        common_quill_setContent(email_unsubscribe_event_edit_editor, email.content);
                    }

                    if(email.type == "event_update"){
                        $("#event_edit_custom_email_event_update").show();
                        $("#event_edit_custom_email_event_update_add").hide();
                        $("#event_edit_custom_email_event_update_remove").show();
                        common_quill_setContent(email_update_event_edit_editor, email.content);
                    }

                    if(email.type == "atv_subscribe"){
                        $("#event_edit_custom_email_atv_subscribe").show();
                        $("#event_edit_custom_email_atv_subscribe_add").hide();
                        $("#event_edit_custom_email_atv_subscribe_remove").show();
                        common_quill_setContent(email_atv_subscribe_event_edit_editor, email.content);
                    }

                })
            
            }

            if(data.certificate){
                $("#event_edit_custom_certificate").show();
                $("#event_edit_custom_certificate_add").hide();
                $("#event_edit_custom_certificate_remove").show();
                common_quill_setContent(cert_event_edit_editor, data.certificate);
            }

        }

    })
}

function event_edit_submit(id){

    var name            = $("#event_edit_name").val();
    var description     = common_quill_getContent(desc_event_edit_editor);
    var startDate       = $("#event_edit_start_date").val();
    var endDate         = $("#event_edit_end_date").val();

    var activities = [];

    $('#event_edit_activity_div').children().each(function () {

        var id              = $(this).attr('id');

        var oldId           = $(`#${id}_oldId`).text();
        var title           = $(`#${id}_title`).val();
        var description     = $(`#${id}_description`).val();
        var startDate_ev    = $(`#${id}_date`).val();
        var duration        = $(`#${id}_duration`).val();

        activities.push({
            _id: oldId,
            title,
            description,
            startDate: common_date_ISOToUnix(startDate_ev),
            duration
        })

    });

    var emails = [];

    if($("#event_edit_custom_email_event_subscribe").is(":visible")){
        emails.push({
            type: "event_subscribe",
            content: common_quill_getContent(email_subscribe_event_edit_editor)
        });
    }

    if($("#event_edit_custom_email_event_unsubscribe").is(":visible")){
        emails.push({
            type: "event_unsubscribe",
            content: common_quill_getContent(email_unsubscribe_event_edit_editor)
        });
    }

    if($("#event_edit_custom_email_event_update").is(":visible")){
        emails.push({
            type: "event_update",
            content: common_quill_getContent(email_update_event_edit_editor)
        });
    }

    if($("#event_edit_custom_email_atv_subscribe").is(":visible")){
        emails.push({
            type: "atv_subscribe",
            content: common_quill_getContent(email_atv_subscribe_event_edit_editor)
        });
    }

    var certificate = null;

    if($("#event_edit_custom_certificate").is(":visible")){
        certificate = common_quill_getContent(cert_event_edit_editor);
    }

    var data = {
        name,
        description,
        startDate: common_date_ISOToUnix(startDate),
        endDate: common_date_ISOToUnix(endDate),
        activities,
        emails,
        certificate
    }

    common_fetch('/api/events/' + id, 'PATCH', data, ['event_edit_message'])

}

function event_edit_activity_add(){
    var uniq = 'id' + (new Date()).getTime() + parseInt(Math.random() * 1000);

    common_append('#event_edit_activity_div', 'con_event_atv.html', {uniq});

}

function event_edit_activity_remove(id){
    $('#' + id).remove();
}

//Really specific functions
function event_edit_custom_certificate_add(){ //Custom certificate
    $("#event_edit_custom_certificate").show();
    $("#event_edit_custom_certificate_add").hide();
    $("#event_edit_custom_certificate_remove").show();
}

function event_edit_custom_certificate_remove(){
    $("#event_edit_custom_certificate").hide();
    $("#event_edit_custom_certificate_add").show();
    $("#event_edit_custom_certificate_remove").hide();
}

function event_edit_custom_email_event_subscribe_add(){ //Custom email event subscribe
    $("#event_edit_custom_email_event_subscribe").show();
    $("#event_edit_custom_email_event_subscribe_add").hide();
    $("#event_edit_custom_email_event_subscribe_remove").show();
}

function event_edit_custom_email_event_subscribe_remove(){
    $("#event_edit_custom_email_event_subscribe").hide();
    $("#event_edit_custom_email_event_subscribe_add").show();
    $("#event_edit_custom_email_event_subscribe_remove").hide();
}

function event_edit_custom_email_event_unsubscribe_add(){ //Custom email event unsubscribe
    $("#event_edit_custom_email_event_unsubscribe").show();
    $("#event_edit_custom_email_event_unsubscribe_add").hide();
    $("#event_edit_custom_email_event_unsubscribe_remove").show();
}

function event_edit_custom_email_event_unsubscribe_remove(){
    $("#event_edit_custom_email_event_unsubscribe").hide();
    $("#event_edit_custom_email_event_unsubscribe_add").show();
    $("#event_edit_custom_email_event_unsubscribe_remove").hide();    
}

function event_edit_custom_email_event_update_add(){ //Custom email event update
    $("#event_edit_custom_email_event_update").show();
    $("#event_edit_custom_email_event_update_add").hide();
    $("#event_edit_custom_email_event_update_remove").show();
}

function event_edit_custom_email_event_update_remove(){
    $("#event_edit_custom_email_event_update").hide();
    $("#event_edit_custom_email_event_update_add").show();
    $("#event_edit_custom_email_event_update_remove").hide();
}

function event_edit_custom_email_atv_subscribe_add(){ //Custom email activity subscribe
    $("#event_edit_custom_email_atv_subscribe").show();
    $("#event_edit_custom_email_atv_subscribe_add").hide();
    $("#event_edit_custom_email_atv_subscribe_remove").show();
}

function event_edit_custom_email_atv_subscribe_remove(){
    $("#event_edit_custom_email_atv_subscribe").hide();
    $("#event_edit_custom_email_atv_subscribe_add").show();
    $("#event_edit_custom_email_atv_subscribe_remove").hide();
}
