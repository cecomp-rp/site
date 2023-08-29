$('document').ready(function () {
    cert_fetch(common_URL_get_last_param());
});

//Fetch event certificates
function cert_fetch(id){

    common_fetch("/api/certificates/by_id/" + id, 'GET').then((data) => {

        if(data){

            $('#cert_title').text(data.title);
            common_quill_pasteContent('#cert_content', data.content);
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

        }else{
            common_cookieWarning_set("certificateNotFound");
            window.location.href = "/certificates";
        }

    });

}

//Download certificate
function cert_download(){
    
    var cert = document.getElementById('certificate');

    var scale = 2;
    var compress_quality = 0.8;

    //Get certificate image (dom-to-image)
    domtoimage.toBlob(cert, 
        {
            width: cert.clientWidth * scale,
            height: cert.clientHeight * scale,
            style: {
                transform: 'scale('+scale+')',
                transformOrigin: 'top left'
            }
        }

    ).then(function (blob) {

        //Set orientation based on width and height
        var p_or_l;
        if(cert.clientWidth > cert.clientHeight){
            p_or_l = 'l';
        }else{
            p_or_l = 'p';
        }

        //Create pdf
        var pdf = new jsPDF(p_or_l, 'px', [cert.clientWidth, cert.clientHeight]);
        var width = pdf.internal.pageSize.getWidth();
        var height = pdf.internal.pageSize.getHeight();

        //Compress with Compressor.js
        new Compressor(blob, {
            quality: compress_quality,

            success(new_blob) {
                
                //blob to base64
                var reader = new FileReader();
                reader.readAsDataURL(new_blob);

                reader.onloadend = function() {
                    base64data = reader.result;

                    //Create image
                    var img = new Image();
                    img.src = base64data;

                    //Add image
                    pdf.addImage(img, 'PNG', 0, 0, width, height, undefined, 'FAST');

                    //Download pdf
                    pdf.save("certificate.pdf");
                    
                }

            }

        });

    });

}