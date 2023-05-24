var event_remove_page = 1;

$('document').ready(function(){
    event_remove_list(event_remove_page);
});

function event_remove_list(){

    fetch("/api/events/by_page/" + event_remove_page, {
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
                <p class="event_remove_id">ID: ${element._id}</p>
                <p class="event_remove_title">Title: ${element.title}</p>
                <p class="event_remove_name">Name: ${element.name}</p>
                <p class="event_remove_description">Description: ${element.description}</p>
            
                <p class="event_remove_createdAt">Created At: ${element.createdAt}</p>
                <p class="event_remove_updatedAt">Updated At: ${element.updatedAt}</p>
                <div class="activities" id="${element._id}_activities"></div>

                <a href="/events/${element.name}">See page...</a>

                <button onclick="event_remove_delete('${element._id}')">Delete</button>
                <button onclick="event_remove_edit('${element._id}')">Edit</button>
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
                <br>
                `;

                $("#" + element._id + "_activities").append(append_activity);

            });
            
        });

    })}).catch((err) => {
        console.log(err)
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

    fetch("/api/events/" + id, {
        method: "DELETE",
        cache: "default", 
        headers: {
            "Content-Type": "application/json",
        }

    }).then((response) =>{

        if(response.status == 200){
            $("#" + id).remove();
            $("#event_remove_div").empty();
            event_remove_list(event_remove_page);
        }else{
            alert("Error deleting item!");
        }
        
    }).catch((err) => {
        console.log(err)
    })

}