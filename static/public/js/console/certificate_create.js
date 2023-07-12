var cert_create_editor;

$('document').ready(function () {

    cert_create_editor = common_quill_createEditor('#cert_create_content');

    $('#cert_create_submit').click(function () {
        cert_create_create();
    });

});

function cert_create_create(){

    const email = $('#cert_create_email').val();
    const title = $('#cert_create_title').val();
    const content = common_quill_getContent(cert_create_editor);
    
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