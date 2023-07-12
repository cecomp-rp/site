var email_atv_editor;

$('document').ready(function(){

    email_atv_editor = common_quill_createEditor('#email_atv_content');

    $('#email_atv_send').attr('disabled', true);

    $('#email_atv_id').on('input',function(){
        email_atv_id_check();
    })

    $('#email_atv_send').click(function(){
        email_atv_send();
    })

})

function email_atv_send(){

    const atv_id = $('#email_atv_id').val();
    const subject = $('#email_atv_subject').val();
    const content = common_quill_getContent(email_atv_editor);
    const filters = {
        role: $('#email_atv_filter_role').val(),
    }

    const data = {
        subject,
        filters,
        content
    }

    common_fetch('/api/emails/actv/' + atv_id, 'POST', data, ['email_atv_msg']);

}

function email_atv_id_check(){

    const atv_id = $('#email_atv_id').val();

    common_fetch('/api/actv/by_id/' + atv_id, 'GET').then((data) => {

        if(data){
            $('#email_atv_send').attr('disabled', false);
        }else{
            $('#email_atv_send').attr('disabled', true);
        }

    })

}