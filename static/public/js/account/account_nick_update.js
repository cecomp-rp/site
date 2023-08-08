$('document').ready(function () {

    //Initial state
    $('#acc_nickUp_btn').attr('disabled', true)

    //Verify nick on input
    $('#acc_nickUp_field').on('input', function () {

        //Verify if the nick is valid (3-15 characters, only letters, numbers and _)
        const nickRegex = /^[a-zA-Z0-9_]{3,15}$/
        if (!(nickRegex.test($('#acc_nickUp_field').val()))) {
            $('#acc_nickUp_btn').attr('disabled', true)
            $('#acc_nickUp_msg').text('Invalid nick!')
            $('#acc_nickUp_msg').attr('class', 'box-4')
            return;
        }

        //Verify if the nick is already in use
        common_fetch('/api/account/nick', 'POST', { nick: $('#acc_nickUp_field').val() }, ['acc_nickUp_msg']).then((data) => {
            if(data){
                if(data.available == false){
                    $('#acc_nickUp_btn').attr('disabled', true)
                    $('#acc_nickUp_msg').attr('class', 'box-4')
                }else{
                    $('#acc_nickUp_btn').attr('disabled', false)
                    $('#acc_nickUp_msg').attr('class', 'box-2')
                }
            }
        })

    })

})

function acc_nickUp_fetch() {
    $('#acc_nickUp_btn').attr('disabled', true)

    common_fetch('/api/account/nick', 'PATCH', { nick: $('#acc_nickUp_field').val() }, ['acc_nickUp_msg']).then((data) => {
        if(data){
            $('#acc_nickUp_field').val('')
        }
    })

}

