$('document').ready(function () {

    cert_fetch(common_URL_get_last_param());

});

//Fetch event certificates
function cert_fetch(id){

    fetch("/api/certificates/by_id/" + id, {})
    .then((response) => {

        response.json().then((certificate) => {

            console.log(certificate);

            $('#cert_title').text(certificate.title);
            $('#cert_content').html(certificate.content);
            $('#cert_owner').text(certificate.owner_id);

            $('#cert_event_id').text(certificate.event_id);
            $('#cert_is_event').text(certificate.is_event_certificate);
            $('#cert_event_link').attr("href", "/events/" + certificate.event_name);

            $('#cert_id').text(certificate._id);
            $('#cert_created_at').text(certificate.createdAt);
            $('#cert_updated_at').text(certificate.updatedAt);


        }).catch((error) => {

            console.log(error);
            res.status(404).send();
            return;

        });

    }).catch((error) => {

        console.log(error);
        res.status(404).send();
        return;

    });
}