$('document').ready(function () {
    nav_title();
    nav_info_fetch();
});

function nav_title(){

    $('#nav-title').text(document.title)

}

function nav_info_fetch(){

    common_fetch('/api/account', 'GET').then((data) => {
        
        //There is a response
        if(data){
            $('#nav_user_nick').text(data.nick)
            $('#nav_user_profilePic').attr('src', data.profilePic)
    
            $('.nav-logged').show();
            $('.nav-notlogged').hide();
        }

        //Else
        else{
            $('.nav-logged').hide();
            $('.nav-notlogged').show();
        }
    
    })

}
