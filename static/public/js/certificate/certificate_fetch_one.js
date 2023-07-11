$('document').ready(function () {
    cert_fetch(common_URL_get_last_param());
});

//Fetch event certificates
function cert_fetch(id){

    common_fetch("/api/certificates/by_id/" + id, 'GET').then((data) => {

        if(data){

            $('#cert_title').text(data.title);
            $('#cert_content').html(data.content);
            $('#cert_owner').text(data.owner_id);

            $('#cert_event_id').text(data.event_id);
            $('#cert_is_event').text(data.is_event_certificate);
            $('#cert_event_link').attr("href", "/events/" + data.event_name);

            $('#cert_id').text(data._id);
            $('#cert_created_at').text(data.created_at);
            $('#cert_updated_at').text(data.updated_at);

        }
    });

}