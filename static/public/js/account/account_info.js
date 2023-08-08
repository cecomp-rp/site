$('document').ready(function () {

    common_fetch('/api/account', 'GET').then((data) => {

        if(data){     
            $('#acc_name').text(data.name)
            $('#acc_email').text(data.email)
            $('#acc_nick').text(data.nick)

            //Roles (array)
            data.roles.forEach((role) => {
                $('#acc_roles').append(`<p>${role}</p>`)
            })

            $('#acc_profilePic').attr('src', data.profilePic)
        }
        
    })

});
