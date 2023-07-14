//Warning
$('document').ready(function () {

    $("#warning").click(function () {
        common_warning_close()
    });

});

function common_warning_open(msg) {
    $("#warning_inner").html(msg);
    $("#warning").show();

    anime({
        targets: '#warning',
        opacity: 1,
        duration: 200,
        easing: 'easeOutCubic'
    });

}

function common_warning_close() {
    anime({
        targets: '#warning',
        opacity: 0,
        duration: 200,
        easing: 'easeOutCubic',
        complete: function () {
            $("#warning").hide();
        }
    });
}

//Confirm

var confirm_callback_string = "";

function uSure(msg, callback_string){
    common_confirm_open(msg, callback_string);
}

function common_confirm_open(msg, callback_string) {
    confirm_callback_string = callback_string;
    $("#confirm_inner").html(msg);
    $("#confirm").show();

    anime({
        targets: '#confirm',
        opacity: 1,
        duration: 200,
        easing: 'easeOutCubic'
    });
}

function common_confirm_accept() {
    anime({
        targets: '#confirm',
        opacity: 0,
        duration: 200,
        easing: 'easeOutCubic',
        complete: function () {
            $("#confirm").hide();
        }
    });

    eval(confirm_callback_string);
}

function common_confirm_dismiss() {
    anime({
        targets: '#confirm',
        opacity: 0,
        duration: 200,
        easing: 'easeOutCubic',
        complete: function () {
            $("#confirm").hide();
        }
    });
}

//Loading

$('document').ready(function () {

    setTimeout(function () {
       common_loading_close();
    }, 200);

    //On any a click
    $("a").click(function (event) {

        //prevent default
        event.preventDefault();

        //find href in a
        var href = $(this).attr("href");

        common_loading_open();

        setTimeout(function () {
            //redirect
            window.location.href = href;
        }, 200);

    });

});

function common_loading_open() {
    $("#loading").show();

    anime({
        targets: '#loading',
        opacity: 1,
        duration: 100,
        easing: 'easeOutCubic'
    });
}

function common_loading_close() {
    anime({
        targets: '#loading',
        opacity: 0,
        duration: 100,
        easing: 'easeOutCubic',
        complete: function () {
            $("#loading").hide();
        }
    });
}

//Nav overlay

$('#nav-overlay').ready(function () {

    //on open
    $("#nav-options-click").click(function () {
        common_nav_overlay_item_scale();
    });

    //Close on click
    $("#nav-overlay").click(function () {
        common_nav_overlay_close()
    });

    //On scroll
    $("#nav-overlay").on('mousewheel', function (event) {

        //Height based on delta
        var current_height_inverse = $("#nav-overlay-scroll").scrollTop();
        var current_height = $("#nav-overlay-scroll").prop('scrollHeight') - $("#nav-overlay-scroll").height() - current_height_inverse;

        if (current_height < 10) {
            //close
            common_nav_overlay_close()
        }

        common_nav_overlay_item_scale()

    });


});

function common_nav_overlay_open() {
    $("#nav-overlay").show();

    anime({
        targets: '#nav-overlay',
        opacity: 1,
        duration: 200,
        easing: 'easeOutCubic'
    });
   
}

function common_nav_overlay_close() {
    anime({
        targets: '#nav-overlay',
        opacity: 0,
        duration: 200,
        easing: 'easeOutCubic',
        complete: function () {
            $("#nav-overlay-scroll").scrollTop(0);
            $("#nav-overlay").hide();
        }
    });
 
}

function common_nav_overlay_item_scale(){

    $(".nav-overlay-item").each(function () {

        //Screen center position
        var screen_center = $(window).height() / 2;

        //Element center position
        var element_position = $(this).offset().top + $(this).height() / 2;

        //Element distance from center
        var element_distance = Math.abs(element_position - screen_center);

        //Calculate scale
        //If element_distance >= 200 then scale = 1
        //If element_distance < 200 then scale goes from 1 to 1.2, depending on element_distance to 0
        if (element_distance < 300) {
            var scale = 1 + (0.3 * (1 - (element_distance / 300)));
        } else {
            var scale = 1;
        }

        //Animate scale
        anime({
            targets: this,
            scale,
            duration: 200,
            easing: 'easeOutCubic'
        });
  
    });

}



