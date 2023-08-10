$('document').ready(function () {
    nav_info_fetch();
    nav_set_title();

    nav_animate_backgrounds();

});

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

function nav_set_title(){
    
    //Set title
    $('#nav-location').text(document.title);
    
}

//Animate background gradient
var bg_main;
function nav_animate_backgrounds(){

    //Main background
    bg_main = new Granim({
        element: '#nav-canvas',
        direction: 'top-bottom',
        isPausedWhenNotInView: true,
        image : {
            source: '../img/bg/ocean.jpg',
            blendingMode: 'multiply',
            stretchMode: ['stretch', 'stretch']
        },
        states : {
            "default-state": {
                gradients: [
                    ['#ffffff', '#9D50BB'],
                    ['#9D50BB', '#6E48AA'],
                    ['#4776E6', '#ffffff']
                ],
                transitionSpeed: 1000
            }
        }
    });

}
