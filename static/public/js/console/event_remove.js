var event_remove_page = 1;

$('document').ready(function(){
    event_remove_list(event_remove_page);
});

function event_remove_list(){

    common_fetch("/api/events/by_page/" + event_remove_page, "GET", {}).then((data) => {

        if(data){

            data.forEach(element => {

                common_append("#event_remove_div", "con_event.html", element).then(() => {

                    //Append activities from element
                    element.activities.forEach(activity => {

                        common_append("#" + element._id + "_activities", "con_event_atv2.html", activity)
        
                    });

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