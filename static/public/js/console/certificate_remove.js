var cert_remove_page = 1;

$('document').ready(function () {

    $("#cert_remove_email").on('input', function () {

        $("#cert_remove_email_message").text("");
        cert_remove_list(cert_remove_page);

    })

});

function cert_remove_remove(id){

    common_fetch('/api/certificates/' + id, 'DELETE').then((data) => {

        if(data){
            $("#" + id).remove();
            cert_remove_list(cert_remove_page);
        }else{
            alert("Error removing certificate! (Probably it is an event certificate)");
        }

    });

}

function cert_remove_next_page(){
    cert_remove_page++; 

    $("#cert_remove_div").empty();
    $("#cert_remove_page_display").text(cert_remove_page);
    cert_remove_list(cert_remove_page);
}

function cert_remove_previous_page(){
    if((cert_remove_page-1)<=0){return;}
    
    cert_remove_page--; 

    $("#cert_remove_div").empty();
    $("#cert_remove_page_display").text(cert_remove_page);
    cert_remove_list(cert_remove_page);

}

function cert_remove_list(page){
    $("#cert_remove_div").empty();

    const email = $("#cert_remove_email").val();

    common_fetch('/api/certificates/by_page_with_email/' + email + '/' + page, 'GET', {}, ['cert_remove_email_message']).then((data) => {

        if(data){

            //For each certificate
            data.forEach((certificate) => {

                var append_model =
                `
                <div id="${certificate._id}">
                    <p>ID: ${certificate._id}</p>
                    <p>Owner ID: ${certificate.owner_id}</p>
                    <p>Event ID: ${certificate.event_id}</p>
                    <p>Is Event Certificate: ${certificate.is_event_certificate}</p>
                    <p>Title: ${certificate.title}</p>
                    <p>Content: ${certificate.content}</p>

                    <button onclick="cert_remove_remove('${certificate._id}')">Remove</button>
                    <button onclick="cert_remove_edit('${certificate._id}')">Edit</button>
                    <a href="/certificates/${certificate._id}">See page...</a>
                </div>
                `;

                $("#cert_remove_div").append(append_model);

            });

        }

    });

}

function cert_remove_edit(id){
    $("#cert_edit_id").val(id);
    $("#cert_edit_id").trigger("input");
}