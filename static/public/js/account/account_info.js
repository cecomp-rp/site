$('document').ready(function () {

    common_fetch('/api/account', 'GET').then((data) => {

        if(data){     
            $('#acc_name').text(data.name)
            $('#acc_email').text(data.email)
            $('#acc_nick').text(data.nick)
            $('#acc_roles').text(data.roles)
            $('#acc_profilePic').attr('src', data.profilePic)
        }
        
    })

});
