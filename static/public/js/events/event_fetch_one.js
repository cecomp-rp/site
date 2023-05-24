$('document').ready(function () {

    var id = get_last_param_from_URL()

    fetch("/api/events/by_name/" + id)
    .then((response) => {
        return response.json()
    }).then((event) => {

        $("#event_title").text(event.title);
        $("#event_name").text(event.name);
        $("#event_description").text(event.description);
        $("#event_startDate").text(event.startDate);
        $("#event_endDate").text(event.endDate);

        //Created at and updated at
        $("#event_createdAt").text(event.createdAt)
        $("#event_updatedAt").text(event.updatedAt)

        //Activities
        event.activities.forEach((activity) => {
            
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

    }).catch((err) => {
        console.log(err)
    })


})

function get_last_param_from_URL(){
    let url = window.location.href
    let url_array = url.split("/")
    let last_param = url_array[url_array.length - 1]
    return last_param
}



