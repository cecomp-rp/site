$('document').ready(function(){

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
    const content = $('#email_atv_content').val();

    const data = {
        subject,
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