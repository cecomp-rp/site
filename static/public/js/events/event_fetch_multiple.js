const event_enable_activities = false;
var event_page = 1;

$('document').ready(function(){
    event_list(event_page);
});

function event_list(){

    fetch("/api/events/by_page/" + event_page, {
        method: "GET",
        cache: "default",
        headers: {
            "Content-Type": "application/json",
        }

    }).then((response) => {response.json().then((data) => {

        data.forEach(element => {

            var append_model = 
            `
            <div id=${element._id}>
                <p class="event_title">Title: ${element.title}</p>
                <p class="event_name">Name: ${element.name}</p>
                <p class="event_description">Description: ${element.description}</p>
            
                <p class="event_createdAt">Created At: ${element.createdAt}</p>
                <p class="event_updatedAt">Updated At: ${element.updatedAt}</p>
                <div class="activities" id="${element._id}_activities"></div>

                <a href="/events/${element.name}">See page...</a>
            </div>
            `;

            $("#event_div").append(append_model);

            //Append activities from element
            if(event_enable_activities){
                element.activities.forEach(activity => {

                    var append_activity = 
                    `
                    <p>Title: ${activity.title}</p>
                    <p>Description: ${activity.description}</p>
                    <p>End Date: ${activity.date}</p>
                    <p>Duration: ${activity.duration}</p>
                    <br>
                    `;

                    $("#" + element._id + "_activities").append(append_activity);

                });
            }
            
        });

    })}).catch((err) => {
        console.log(err)
    })

}

function event_next_page(){
    event_page++; 

    $("#event_div").empty();
    $("#event_page_display").text(event_page);
    event_list(event_page);
}

function event_previous_page(){
    if((event_page-1)<=0){return;}
    
    event_page--; 

    $("#event_div").empty();
    $("#event_page_display").text(event_page);
    event_list(event_page);

}