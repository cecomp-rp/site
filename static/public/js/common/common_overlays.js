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

function uSure(callback_string){
    common_confirm_open(`
    <p class='text-3'>Tem certeza que deseja prosseguir com esta ação?</p>
    `, callback_string);
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

var is_loading = true;

window.addEventListener("pageshow", function ( event ) { //On page show, close loading
    setTimeout(function () { 
        common_loading_close();
    }, 200);
});

$('document').ready(function () {

    //On any a click
    $("body").on('click', 'a', function (event) {

        //Exceptions
        const excp = [
            '.editor'
        ];
        for (var i = 0; i < excp.length; i++) {
            if ($(this).parents(excp[i]).length) {
                return;
            }
        }

        //prevent default
        event.preventDefault();

        //find href in a
        var href = $(this).attr("href");

        common_loading_open();

        setTimeout(function () {
    
            //redirect
            window.location.href = href;

        }, 200);

        setTimeout(function () {
    
            common_loading_close();

        }, 5000);

    });

    //On any button with class "a" click
    $("body").on('click', '.a', function (event) {

        //prevent default
        event.preventDefault();

        //find href in button
        var href = $(this).attr("href");

        common_loading_open();

        setTimeout(function () {    

            //redirect
            if (href == undefined) {
                common_loading_close();
                return;
            }
            window.location.href = href;

        }, 200);
     
    });

});

function common_loading_open() {
    if (is_loading) {return;}
    is_loading = true;
    
    $("#loading").show();

    anime({
        targets: '#loading',
        opacity: 1,
        duration: 100,
        easing: 'easeOutCubic'
    });
}

function common_loading_close() {
    if (!is_loading) {return;}
    is_loading = false;

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

var is_nav_overlay_open = false;
var nav_anim_block = false;

var nav_endpage_block = false;
var nav_endpage_count = 0;

var last_height = 0;

$('#nav-overlay').ready(function () {

    //on open
    $("#nav-options-click").click(function () {
        common_nav_overlay_item_scale();
    });

    //Close on click
    $("#nav-overlay").click(function () {
        common_nav_overlay_close()
    });

    //On scroll - desktop
    $("#nav-overlay-scroll").on('scroll', function (event) {
        common_nav_event(event);
    });

});

function common_nav_event(event) {

    //Height based on delta
    var current_height_inverse = $("#nav-overlay-scroll").scrollTop();
    var current_height = $("#nav-overlay-scroll").prop('scrollHeight') - $("#nav-overlay-scroll").height() - current_height_inverse;

    var current_height_percent = current_height / $("#nav-overlay-scroll").prop('scrollHeight');

    //Delta movement
    var elasticity = 1;

    var delta = Math.abs(current_height - last_height);
    last_height = current_height;

    var delta_tolerance = 20;
    if (delta < delta_tolerance) {delta = 0;}

    var delta_max = 100;
    if ((delta ^ elasticity) > delta_max) {delta = delta_max;}

    var scroll_up = Math.abs((delta ^ elasticity) * (current_height_percent ^ elasticity));

    var max_scroll_up = 50;
    if (scroll_up > max_scroll_up) {scroll_up = max_scroll_up;}

    //Closing
    var down_trigger_height = 20;
    var up_trigger_height = down_trigger_height + scroll_up + 50;
    
    if(current_height < down_trigger_height) {

        if(!nav_endpage_block && nav_endpage_count == 0){
            nav_endpage_block = true;
            nav_endpage_count = 1;

            //Scroll back 100px
            $("#nav-overlay-scroll").animate({
                scrollTop: current_height_inverse - scroll_up,
                complete: function () {
                    nav_endpage_block = false;
                }
            }, 100);

            setTimeout(function () {
                nav_endpage_block = false;
            }, 100);
            
        }

        if(!nav_endpage_block && nav_endpage_count == 1){
            nav_endpage_count = 0;
            common_nav_overlay_close();
        }

    }

    else if (current_height > up_trigger_height) {
        nav_endpage_count = 0;
    }

    common_nav_overlay_item_scale();

}

function common_nav_overlay_open() {
    if (is_nav_overlay_open) {return;}
    is_nav_overlay_open = true;
    
    $("#nav-overlay").show();

    anime({
        targets: '#nav-overlay',
        opacity: 1,
        duration: 200,
        easing: 'easeOutCubic'
    });
   
}

function common_nav_overlay_close() {
    if (!is_nav_overlay_open) {return;}
    is_nav_overlay_open = false;
    
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

    return $(".nav-overlay-item").each(function () {

        //Screen center position
        var screen_center = $(window).height() / 2;

        //Element center position
        var element_position = $(this).offset().top + $(this).height() / 2;

        //Element distance from center
        var element_distance = Math.abs(element_position - screen_center);

        //Calculate scale
        //If element_distance >= 200 then scale = 1
        //If element_distance < 200 then scale goes from 1 to 1.2, depending on element_distance to 0
        var distance_frame = (window.innerHeight / 10) * 7;
        var scale_variance = 0.4;
        
        if (element_distance < distance_frame) {
            var scale = 1 + (scale_variance * (1 - (element_distance / distance_frame)));
        } else {
            var scale = 1;
        }

        //Animate scale
        anime({
            targets: this,
            scale,
            duration: 1
        });
  
    });

}



