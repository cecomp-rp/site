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

    fetch('/api/certificates', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(data)

    }).then((response) => {

        if(response.status == 201){
            $('#cert_create_email').val('');
            $('#cert_create_message').text('Certificado criado com sucesso!');
        }else{
            $('#cert_create_message').text('Erro ao criar certificado!');
        }

    }).catch((error) => {
        
        console.log(error);
        $('#cert_create_message').text('Erro ao criar certificado!');

    });


}