//Warning

$(document).ready(function () {

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


