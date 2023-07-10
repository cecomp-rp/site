$('document').ready(function(){

    $('#email_global_send').click(function(){

        email_global_send();

    })

})

function email_global_send(){

    const subject = $('#email_global_subject').val();
    const content = $('#email_global_content').val();

    const data = {
        subject,
        content
    }

    common_fetch('/api/emails/global', 'POST', data, ['email_global_msg']);

}
