$('document').ready(function () {

    $('#cert_edit_id').on('input', function () {
        $('#cert_edit_title').val("");
        $('#cert_edit_content').val("");
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

    fetch('/api/certificates/by_id/' + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },

    }).then((response) => {

        if(response.status == 200){
            response.json().then((data) => {

                if(data.is_event_certificate){
                    $('#cert_edit_id_message').text('Certificado de evento não pode ser editado!');
                }else{
                    $('#cert_edit_submit').prop('disabled', false);
                }

                $('#cert_edit_title').val(data.title);
                $('#cert_edit_content').val(data.content);
            });
        }else{
            $('#cert_edit_id_message').text('Erro ao buscar certificado!');
        }

    }).catch((error) => {
        
        console.log(error);
        $('#cert_edit_id_message').text('Erro ao buscar certificado!');

    });

}

function cert_edit_edit(){

    const id = $('#cert_edit_id').val();
    const title = $('#cert_edit_title').val();
    const content = $('#cert_edit_content').val();
    
    const data = {
        title: title,
        content: content
    }

    fetch('/api/certificates/' + id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(data)

    }).then((response) => {

        if(response.status == 200){
            $('#cert_edit_message').text('Certificado atualizado com sucesso!');
        }else{
            $('#cert_edit_message').text('Erro ao atualizar certificado!');
        }

    }).catch((error) => {
        
        console.log(error);
        $('#cert_edit_message').text('Erro ao atualizar certificado!');

    });


}