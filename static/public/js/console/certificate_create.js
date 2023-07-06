$('document').ready(function () {

    $('#cert_create_submit').click(function () {
        cert_create_create();
    });

});

function cert_create_create(){

    const email = $('#cert_create_email').val();
    const title = $('#cert_create_title').val();
    const content = $('#cert_create_content').val();
    
    const data = {
        email: email,
        title: title,
        content: content
    }

    common_fetch('/api/certificates', 'POST', data, ['cert_create_message']).then((data) => {

        if(data){
            $('#cert_create_email').val('');
        }

    });


}