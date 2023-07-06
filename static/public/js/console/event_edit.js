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

    common_fetch('/api/events/by_id/' + id, 'GET', {}, ['event_edit_message']).then((data) => {

        if(data){

            if(data == null){ return; }//Necessário?

            $("#event_edit_name").val(data.title);
            $("#event_edit_description").val(data.description);

            var jquery_endDate = data.endDate.split('T')[0];
            var jquery_startDate = data.startDate.split('T')[0];

            $("#event_edit_start_date").val(jquery_startDate);
            $("#event_edit_end_date").val(jquery_endDate);

            data.activities.forEach((activity) => {

                var uniq = 'id' + (new Date()).getTime() + parseInt(Math.random() * 1000);
                
                if(activity.date){var jquery_date = activity.date.split('T')[0];}
                
                var append_model =
                `
                <div id="${uniq}">
                    <p id="${uniq}_oldId" style="display:none;">${activity._id}</p>
                    <input type="text" id="${uniq}_title" placeholder="Title (required)" value="${activity.title}"></input>
                    <textarea id="${uniq}_description" placeholder="Description">${activity.description}</textarea>
                    <input type="datetime-local" id="${uniq}_date" placeholder="Date" value="${jquery_date}"></input>
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

        var oldId       = $(`#${id}_oldId`).text();
        var title       = $(`#${id}_title`).val();
        var description = $(`#${id}_description`).val();
        var date        = $(`#${id}_date`).val();
        var duration    = $(`#${id}_duration`).val();

        activities.push({
            _id: oldId,
            title,
            description,
            date,
            duration
        })

    });

    var data = {
        name,
        description,
        startDate,
        endDate,
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