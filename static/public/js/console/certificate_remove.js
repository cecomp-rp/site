var cert_remove_page = 1;

$('document').ready(function () {

    $("#cert_remove_email").on('input', function () {

        $("#cert_remove_email_message").text("");
        cert_remove_list(cert_remove_page);

    })

});

function cert_remove_remove(id){

    fetch("/api/certificates/" + id, {

        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },

    }).then((response) => {

        if(response.status != 200){
            alert("Error removing certificate! (Event certificate cannot be removed)");
            return;
        }

        $("#" + id).remove();
        cert_remove_list(cert_remove_page);

    }).catch((error) => {

        console.log(error);

    })


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

    fetch("/api/certificates/by_page_with_email/" + email + "/" + page, {

        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },

    }).then((response) => {

        if(response.status != 200){
            $("#cert_remove_email_message").text("Email not found");
            return;
        }

        //Parse certificate list
        response.json().then((certificates) => {

            //For each certificate
            certificates.forEach((certificate) => {

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
                </div>
                `;

                $("#cert_remove_div").append(append_model);


            });

        })
    
    }).catch((error) => {

        console.log(error);

    })


}
