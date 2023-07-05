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

        var id          = $(this).attr('id');
        var title       = $(`#${id}_title`).val();
        var description = $(`#${id}_description`).val();
        var date        = $(`#${id}_date`).val();
        var duration    = $(`#${id}_duration`).val();

        activities.push({
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

    fetch('/api/events', {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
            'Content-Type': 'application/json'
        }

    }).then((response) => {
            
        if(response.status == 201){
            $('#event_create_message').text("Success!")
        }else{
            $('#event_create_message').text("Error creating the event!")
        }
    
    }).catch((error) => {

        console.log(error)

    })

}

function event_create_activity_add(){
    var uniq = 'id' + (new Date()).getTime() + parseInt(Math.random() * 1000);

    var append_model =
    `
    <div id="${uniq}">
        <input type="text" id="${uniq}_title" placeholder="Title (required)"></input>
        <textarea id="${uniq}_description" placeholder="Description"></textarea>
        <input type="datetime-local" id="${uniq}_date" placeholder="Date"></input>
        <input type="number" id="${uniq}_duration" placeholder="Duration"></input>
        <button onclick="event_create_activity_remove('${uniq}')">Remove</button>
    </div>
    `;

    $('#event_create_activity_div').append(append_model);

}

function event_create_activity_remove(id){

    $('#' + id).remove();

}