$('document').ready(function () {

    $('#contact_send').click(function () { 
        contact_fetch()
    })

})

function contact_fetch(){

    var data = {
        type: $('#contact_type').val(),
        email: $('#contact_email').val(),
        content: $('#contact_content').val()
    }

    common_fetch('/api/contact', 'POST',  data, ['contact_msg']);

}

    