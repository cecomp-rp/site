var cert_fetch_page = 1;

$('document').ready(function () {
    cert_fetch_list(cert_fetch_page)
});

function cert_fetch_next_page(){
    cert_fetch_page++; 

    $("#cert_fetch_div").empty();
    $("#cert_fetch_page_display").text(cert_fetch_page);
    cert_fetch_list(cert_fetch_page);
}

function cert_fetch_previous_page(){
    if((cert_fetch_page-1)<=0){return;}
    
    cert_fetch_page--; 

    $("#cert_fetch_div").empty();
    $("#cert_fetch_page_display").text(cert_fetch_page);
    cert_fetch_list(cert_fetch_page);
}

function cert_fetch_list(page){

    $("#cert_fetch_div").empty();

    const email = $("#cert_fetch_email").val();

    fetch("/api/certificates/by_page/" + page, {

        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },

    }).then((response) => {

        if(response.status != 200){
            console.log("Error: " + response.status);
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

                    <a href="/certificates/${certificate._id}">See page...</a>
                </div>
                `;

                $("#cert_fetch_div").append(append_model);


            });

        })
    
    }).catch((error) => {

        console.log(error);

    })


}