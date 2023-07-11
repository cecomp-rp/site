var event_page = 1;

$('document').ready(function(){
    event_list(event_page);
});

function event_list(){

    common_fetch("/api/events/by_page/" + event_page, "GET", {}).then((data) => {

        if(data){

            data.forEach(element => {

                common_append("#event_div", "event_event.html", element);
    
            });

        }

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
