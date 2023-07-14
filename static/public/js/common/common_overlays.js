//Warning

$('document').ready(function () {

    $("#warning").click(function () {
        common_warning_close()
    });

});

function common_warning_open(msg) {
    $("#warning_inner").html(msg);
    $("#warning").show();
}

function common_warning_close() {
    $("#warning").hide();
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
}

function common_confirm_accept() {
    $("#confirm").hide();
    eval(confirm_callback_string);
}

function common_confirm_dismiss() {
    $("#confirm").hide();
}

//Loading

function common_loading_open() {
    $("#loading").show();
}

function common_loading_close() {
    $("#loading").hide();
}

//Nav overlay
$('#nav-overlay').ready(function () {

    common_nav_overlay_item_scale();

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



