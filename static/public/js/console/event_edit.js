$('document').ready(function(){

    //Fetch events by ID
    $("#event_edit_id").on('input', function(){
        var id = $("#event_edit_id").val();
        event_edit_fetch(id);
    });

    //Submit event
    $("#event_edit_submit").click(function(){
        var id = $("#event_edit_id").val();
        event_edit_submit(id);
    });

});

function event_edit_fetch(id){

    $("#event_edit_name").val("");
    $("#event_edit_description").val("");
    $("#event_edit_start_date").val("");
    $("#event_edit_end_date").val("");
    $("#event_edit_activity_div").empty();

    common_fetch('/api/events/by_id/' + id, 'GET', {}, []).then((data) => {

        if(data){

            if(data == null){ return; }//Necessário?

            $("#event_edit_name").val(data.title);
            $("#event_edit_description").val(data.description);

            $("#event_edit_start_date").val(common_date_unixToISO(data.startDate));
            $("#event_edit_end_date").val(common_date_unixToISO(data.endDate));

            data.activities.forEach((activity) => {

                var uniq = 'id' + (new Date()).getTime() + parseInt(Math.random() * 1000);
                  
                var append_model =
                `
                <div id="${uniq}">
                    <p id="${uniq}_oldId" style="display:none;">${activity._id}</p>
                    <input type="text" id="${uniq}_title" placeholder="Title (required)" value="${activity.title}"></input>
                    <textarea id="${uniq}_description" placeholder="Description">${activity.description}</textarea>
                    <input type="datetime-local" id="${uniq}_date" placeholder="Date" value="${common_date_unixToISO(data.startDate)}"></input>
                    <input type="number" id="${uniq}_duration" placeholder="Duration" value="${activity.duration}"></input>
                    <button onclick="event_edit_activity_remove('${uniq}')">Remove</button>
                </div>
                `;

                $('#event_edit_activity_div').append(append_model);

            })

        }

    })
}

function event_edit_submit(id){

    var name            = $("#event_edit_name").val();
    var description     = $("#event_edit_description").val();
    var startDate       = $("#event_edit_start_date").val();
    var endDate         = $("#event_edit_end_date").val();

    var activities = [];

    $('#event_edit_activity_div').children().each(function () {

        var id          = $(this).attr('id');

        var oldId           = $(`#${id}_oldId`).text();
        var title           = $(`#${id}_title`).val();
        var description     = $(`#${id}_description`).val();
        var startDate_ev    = $(`#${id}_date`).val();
        var duration        = $(`#${id}_duration`).val();

        activities.push({
            _id: oldId,
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

    common_fetch('/api/events/' + id, 'PATCH', data, ['event_edit_message'])

}

function event_edit_activity_add(){
    var uniq = 'id' + (new Date()).getTime() + parseInt(Math.random() * 1000);

    var append_model =
    `
    <div id="${uniq}">
        <input type="text" id="${uniq}_title" placeholder="Title (required)"></input>
        <textarea id="${uniq}_description" placeholder="Description"></textarea>
        <input type="date" id="${uniq}_date" placeholder="Date"></input>
        <input type="number" id="${uniq}_duration" placeholder="Duration"></input>
        <button onclick="event_edit_activity_remove('${uniq}')">Remove</button>
    </div>
    `;

    $('#event_edit_activity_div').append(append_model);

}

function event_edit_activity_remove(id){

    $('#' + id).remove();

}