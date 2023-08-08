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

    common_fetch('/api/certificates/by_page/' + page, 'GET').then((data) => {

        if(data){

            //For each certificate
            data.forEach((certificate) => {

                common_append("#cert_fetch_div", "cert_certificate.html", certificate).then(() => {

                    //Is event certificate?
                    if(certificate.is_event_certificate == true){
                        cert_mark_event_cert(certificate._id)
                    }


                });

                
            });

        }

    });

}

//Test events for event certificates
function cert_mark_event_cert(id){

    //Make evt_cert div visible
    $("#" + id + "_evt_cert").show();

}