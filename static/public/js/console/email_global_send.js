var email_global_editor;

$('document').ready(function(){

    email_global_editor = common_quill_createEditor('#email_global_content');

    $('#email_global_send').click(function(){

        email_global_send();

    })

})

function email_global_send(){

    const subject = $('#email_global_subject').val();
    const content = common_quill_getContent(email_global_editor);
    const filters = {
        role: $('#email_global_filter_role').val(),
    }

    const data = {
        subject,
        filters,
        content
    }

    common_fetch('/api/emails/global', 'POST', data, ['email_global_msg']);
}
