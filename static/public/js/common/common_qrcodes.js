$(document).ready(function(){
    common_createQRcodes();
});

function common_createQRcodes(){

    $('.create-qrcode').each(function(){
        
        //Check if the div already has a QR code
        if($(this).hasClass('qrcode-created')){return;}

        //Create a unique ID for the div
        var divId = 'qrcode-' + Math.floor(Math.random() * 1000000000);
        $(this).attr('id', divId);

        //Get the link
        var link = $(this).text();
        $(this).text('');

        //Create the QR code
        new QRCode(divId, {
            text: link,
            width: 200,
            height: 200,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });

        //Add class 'qrcode-created'
        $(this).addClass('qrcode-created');

    });

}