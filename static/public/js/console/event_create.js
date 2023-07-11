$('document').ready(function(){

    $("#event_create_submit").click(function(){
        event_create_submit();
    });

});

function event_create_submit(){

    var name            = $("#event_create_name").val();
    var description     = $("#event_create_description").val();
    var startDate       = $("#event_create_start_date").val();
    var endDate         = $("#event_create_end_date").val();

    var activities = [];

    $('#event_create_activity_div').children().each(function () {

        var id              = $(this).attr('id');
        var title           = $(`#${id}_title`).val();
        var description     = $(`#${id}_description`).val();
        var startDate_ev    = $(`#${id}_date`).val();
        var duration        = $(`#${id}_duration`).val();

        activities.push({
            title,
            description,
            startDate: common_date_ISOToUnix(startDate_ev),
            duration
        })

    });

    var data = {
        name,
        description,
        startDate: common_date_ISOToUnix(startDate),
        endDate: common_date_ISOToUnix(endDate),
        activities
    }

    common_fetch('/api/events', 'POST', data, ['event_create_message'])

}

function event_create_activity_add(){
    var uniq = 'id' + (new Date()).getTime() + parseInt(Math.random() * 1000);

    common_append('#event_create_activity_div', 'con_event_atv.html', {uniq});

}

function event_create_activity_remove(id){

    $('#' + id).remove();

}