var cert_edit_editor;

$('document').ready(function () {

    cert_edit_editor = common_quill_createEditor('#cert_edit_content');

    $('#cert_edit_id').on('input', function () {
        $('#cert_edit_title').val("");
        common_quill_clearContent(cert_edit_editor);
        $('#cert_edit_id_message').text("");
        $('#cert_edit_submit').prop('disabled', true);
        
        cert_edit_fetch();
    });

    $('#cert_edit_submit').click(function () {
        $('#cert_edit_message').text("");
        
        cert_edit_edit();
    });


});

function cert_edit_fetch(){

    const id = $('#cert_edit_id').val();

    common_fetch('/api/certificates/by_id/' + id, 'GET', {}, ['cert_edit_id_message']).then((data) => {

        if(data){

            if(data.is_event_certificate){
                $('#cert_edit_id_message').text('Certificado de evento não pode ser editado!');
            }else{
                $('#cert_edit_submit').prop('disabled', false);
            }

            $('#cert_edit_title').val(data.title);
            common_quill_setContent(cert_edit_editor, data.content);

        }

    });

}

function cert_edit_edit(){

    const id = $('#cert_edit_id').val();
    const title = $('#cert_edit_title').val();
    const content = common_quill_getContent(cert_edit_editor);
    
    const data = {
        title: title,
        content: content
    }

    common_fetch('/api/certificates/' + id, 'PATCH', data, ['cert_edit_message'])

}