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

            if(data.is_event_certificate){
                $('#cert_evt').show();
                $('#cert_event_link').attr("href", "/events/" + data.event_name);
            }

            $('#cert_id').text(data._id);
            $('#cert_link').text(window.location.origin + "/certificates/" + data._id);
            $('#cert_link').attr("href", window.location.origin + "/certificates/" + data._id);
            $('#cert_created_at').text(data.created_at);
            $('#cert_updated_at').text(data.updated_at);

            //Format dates
            common_format_dates();

        }
    });

}

//Download certificate
function cert_download(){
    
    var cert = document.getElementById('certificate');

    //Get certificate image (dom-to-image)
    domtoimage.toPng(cert)
    .then(function (dataUrl) {

        //Create image
        var img = new Image();
        img.src = dataUrl;

        //Get div size
        var img_width = cert.offsetWidth;
        var img_height = cert.offsetHeight;

        //Create pdf (proportional to content size)
        var pdf = new jsPDF('p', 'pt', [img_width, img_height]);

        //Add image to pdf
        pdf.addImage(img, 'PNG', 0, 0, img_width, img_height);

        //Download pdf
        pdf.save("Certificado.pdf");

        //Close loading
        common_loading_close()

    })



}