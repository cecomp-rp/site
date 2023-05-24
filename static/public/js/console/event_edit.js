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

    fetch("/api/events/by_id/" + id , {
        method: "GET",
        cache: "default", 
        headers: {
            "Content-Type": "application/json",
        }
    }).then((response) => {
        if(response.status == 200){
            return response.json();
        }else{
            return null;
        }

    }).then((event) => {

        if(event != null){
            $("#event_edit_name").val(event.title);
            $("#event_edit_description").val(event.description);

            var jquery_endDate = event.endDate.split('T')[0];
            var jquery_startDate = event.startDate.split('T')[0];

            $("#event_edit_start_date").val(jquery_startDate);
            $("#event_edit_end_date").val(jquery_endDate);

            event.activities.forEach((activity) => {

                var uniq = 'id' + (new Date()).getTime() + parseInt(Math.random() * 1000);
                
                if(activity.date){var jquery_date = activity.date.split('T')[0];}
                
                var append_model =
                `
                <div id="${uniq}">
                    <input type="text" id="${uniq}_title" placeholder="Title (required)" value="${activity.title}"></input>
                    <textarea id="${uniq}_description" placeholder="Description">${activity.description}</textarea>
                    <input type="date" id="${uniq}_date" placeholder="Date" value="${jquery_date}"></input>
                    <input type="number" id="${uniq}_duration" placeholder="Duration" value="${activity.duration}"></input>
                    <button onclick="event_edit_activity_remove('${uniq}')">Remove</button>
                </div>
                `;

                $('#event_edit_activity_div').append(append_model);

            })

        }

    }).catch((err) => {
        console.log(err)
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

    fetch('/api/events/' + id, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers:{
            'Content-Type': 'application/json'
        }

    }).then((response) => {
            
        if(response.status == 200){
            $('#event_edit_message').text("Success!")
        }else{
            $('#event_edit_message').text("Error editing the event!")
        }
    
    }).catch((error) => {

        console.log(error)

    })

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