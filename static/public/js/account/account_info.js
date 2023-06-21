$('document').ready(function () {

    acc_info_fetch()

});

function acc_info_fetch(){

    fetch('/api/account', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }   

    }).then((res) => {

        if(res.status == 200){

            res.json().then((data) => {

                $('#acc_name').text(data.name)
                $('#acc_email').text(data.email)
                $('#acc_nick').text(data.nick)
                $('#acc_roles').text(data.roles)

                $('#acc_profilePic').attr('src', data.profilePic)

            })

        }

    })

}