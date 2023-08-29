$('document').ready(function () {

    var id = get_last_param_from_URL()

    common_fetch("/api/events/by_name/" + id, "GET", {}).then((data) => {

        if(data){

            $("#event_title").text(data.title);
            $("#event_name").text(data.name);
            common_quill_pasteContent("#event_description", data.description)

            $("#event_startDate").text(data.startDate);
            $("#event_endDate").text(data.endDate);

            //Created at and updated at
            $("#event_createdAt").text(data.created_at)
            $("#event_updatedAt").text(data.updated_at)
    
            common_format_dates();

            //Activities
            data.activities.forEach((activity) => {
                
                common_append("#event_activities", "event_atv.html", activity);

            })

        }else{
            common_cookieWarning_set("eventNotFound")
            window.location.href = "/events"
        }

    })

})

function get_last_param_from_URL(){
    let url = window.location.href
    let url_array = url.split("/")
    let last_param = url_array[url_array.length - 1]
    return last_param
}



