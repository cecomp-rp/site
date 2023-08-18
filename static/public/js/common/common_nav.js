$('document').ready(function () {
    nav_info_fetch();
    nav_set_title();

    nav_animate_backgrounds();

    //Reload simplebar if needed
    if(sb_body){sb_body.recalculate();}

});

function nav_info_fetch(){

    common_fetch('/api/account', 'GET').then((data) => {
        
        //There is a response
        if(data){
            $('#nav_user_nick').text(data.nick)
            $('#nav_user_profilePic').attr('src', data.profilePic)
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
                transitionSpeed: 5000
            }
        }
    });

}
