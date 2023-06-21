$('document').ready(function () {

    $('#acc_nickUp_field').on('input', function () {

        $('#acc_nickUp_btn').attr('disabled', true)
        $('#acc_nickUp_msg').text('')
        
        //Verify if the nick is valid (3-15 characters, only letters, numbers and _)
        const nickRegex = /^[a-zA-Z0-9_]{3,15}$/

        if (!(nickRegex.test($('#acc_nickUp_field').val()))) {
            $('#acc_nickUp_btn').attr('disabled', true)
            $('#acc_nickUp_msg').text('Invalid nick!')
            return;
        }

        //Verify if the nick is already in use
        acc_nickUp_verify($('#acc_nickUp_field').val()).then((available) => {
            if(available == false){
                $('#acc_nickUp_btn').attr('disabled', true)
                $('#acc_nickUp_msg').text('Nick already in use!')
                return;
            }
        })

        $('#acc_nickUp_btn').attr('disabled', false)
        $('#acc_nickUp_msg').text('Nick available!')

    })

})

function acc_nickUp_fetch() {

    fetch('/api/account/nick', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nick: $('#acc_nickUp_field').val() })

    }).then((res) => {

        if (res.status == 200) {

            res.json().then((data) => {

                $('#acc_nickUp_btn').attr('disabled', true)
                $('#acc_nickUp_msg').text('Nick updated.')

            })

        } else {

            res.json().then((data) => {

                $('#acc_nickUp_btn').attr('disabled', true)
                $('#acc_nickUp_msg').text(data.error)

            })

        }

    })

}

function acc_nickUp_verify(nick) {

    return fetch('/api/account/nick', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nick: nick })

    }).then((res) => {

        if (res.status == 200) {
            
            return res.json().then((data) => {

                return data.available
            })

        } else {return false}

    })

}

