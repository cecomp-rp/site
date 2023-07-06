$('document').ready(function () {

    var id = get_last_param_from_URL()

    common_fetch("/api/events/by_name/" + id, "GET", {}).then((data) => {

        if(data){

            $("#event_title").text(data.title);
            $("#event_name").text(data.name);
            $("#event_description").text(data.description);
            $("#event_startDate").text(data.startDate);
            $("#event_endDate").text(data.endDate);
    
            //Created at and updated at
            $("#event_createdAt").text(data.createdAt)
            $("#event_updatedAt").text(data.updatedAt)
    
            //Activities
            data.activities.forEach((activity) => {
                
                var append_model = 
                `
                <br>
                <p>Title: ${activity.title}</p>
                <p>Description: ${activity.description}</p>
                <p>End Date: ${activity.date}</p>
                <p>Duration: ${activity.duration}</p>
    
                `;
    
                $("#event_activities").append(append_model);
    
            })

        }

    })

})

function get_last_param_from_URL(){
    let url = window.location.href
    let url_array = url.split("/")
    let last_param = url_array[url_array.length - 1]
    return last_param
}



