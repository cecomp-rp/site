var event_remove_page = 1;

$('document').ready(function(){
    event_remove_list(event_remove_page);
});

function event_remove_list(){

    common_fetch("/api/events/by_page/" + event_remove_page, "GET", {}).then((data) => {

        if(data){

            data.forEach(element => {

                var append_model = 
                `
                <div id=${element._id}>
                    <p class="event_remove_id">ID: ${element._id}</p>
                    <p class="event_remove_title">Title: ${element.title}</p>
                    <p class="event_remove_name">Name: ${element.name}</p>
                    <p class="event_remove_description">Description: ${element.description}</p>
    
                    <p class="event_remove_start_date">Start Date: ${element.startDate}</p>
                    <p class="event_remove_end_date">End Date: ${element.endDate}</p>
    
                    <p class="event_remove_createdAt">Created At: ${element.createdAt}</p>
                    <p class="event_remove_updatedAt">Updated At: ${element.updatedAt}</p>
                    <p>Subscribe link: ${window.location.origin + "/sub/" + element.name}</p>
                    
                    <br>
                    <div class="activities" id="${element._id}_activities"></div>
    
                    <a href="/events/${element.name}">See page...</a>
    
                    <button onclick="event_remove_delete('${element._id}')">Delete</button>
                    <button onclick="event_remove_edit('${element._id}')">Edit</button>
                    <br>
                </div>
                `;
    
                $("#event_remove_div").append(append_model);
    
                //Append activities from element
                element.activities.forEach(activity => {
    
                    var append_activity = 
                    `
                    <p>Activity ID: ${activity._id}</p>
                    <p>Title: ${activity.title}</p>
                    <p>Description: ${activity.description}</p>
                    <p>End Date: ${activity.date}</p>
                    <p>Duration: ${activity.duration}</p>
                    <p>Checkin link: ${window.location.origin + "/actv/" + activity._id}</p>
                    <br>
                    `;
    
                    $("#" + element._id + "_activities").append(append_activity);
    
                });
                
            });

        }

    })

}

function event_remove_next_page(){
    event_remove_page++; 

    $("#event_remove_div").empty();
    $("#event_remove_page_display").text(event_remove_page);
    event_remove_list(event_remove_page);
}

function event_remove_previous_page(){
    if((event_remove_page-1)<=0){return;}
    
    event_remove_page--; 

    $("#event_remove_div").empty();
    $("#event_remove_page_display").text(event_remove_page);
    event_remove_list(event_remove_page);

}

function event_remove_edit(id){
    $("#event_edit_id").val(id);
    event_edit_fetch(id);
}

function event_remove_delete(id){

    common_fetch("/api/events/" + id, "DELETE", {}).then((data) => {

        if(data){
            $("#" + id).remove();
            $("#event_remove_div").empty();
            event_remove_list(event_remove_page);
        }else{
            alert("Error deleting item!");
        }

    })

}