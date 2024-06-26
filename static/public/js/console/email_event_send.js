var email_event_editor;

$('document').ready(function(){

    email_event_editor = common_quill_createEditor('#email_event_content');

    $('#email_event_send').attr('disabled', true);

    $('#email_event_id').on('input',function(){
        email_event_id_check();
    })

    $('#email_event_send').click(function(){
        email_event_send();
    })

})

function email_event_send(){

    const event_id = $('#email_event_id').val();
    const subject = $('#email_event_subject').val();
    const content = common_quill_getContent(email_event_editor);
    const filters = {
        role: $('#email_event_filter_role').val(),
    }

    const data = {
        subject,
        filters,
        content
    }

    common_fetch('/api/emails/event/' + event_id, 'POST', data, ['email_event_msg']);
}

function email_event_id_check(){

    const event_id = $('#email_event_id').val();

    common_fetch('/api/events/by_id/' + event_id, 'GET').then((data) => {

        if(data){
            $('#email_event_send').attr('disabled', false);
        }else{
            $('#email_event_send').attr('disabled', true);
        }

    })

}