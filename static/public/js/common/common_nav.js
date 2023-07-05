$('document').ready(function () {
    nav_title();
    nav_info_fetch();
});

function nav_title(){

    $('#nav-title').text(document.title)

}

function nav_info_fetch(){

    fetch('/api/account', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }   

    }).then((res) => {

        if(res.status == 200){

            //Logged
            res.json().then((data) => {

                $('#nav_user_nick').text(data.nick)
                $('#nav_user_profilePic').attr('src', data.profilePic)

                $('.nav-logged').show();
                $('.nav-notlogged').hide();

            })

        }

    })

}
