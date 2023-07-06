$('document').ready(function() {

    sub_event_list_load();
});

function sub_event_list_load(){

    common_fetch("/api/sub/", "GET", {}, []).then((data) => {

        if(data){

            data.forEach(function(event) {

                var append_model = 
                `
                <p>${event.title}</p>
                <p>${event.description}</p>
                <a href="/events/${event.name}">See page...</a>
                <br>
                `;

                $('#sub_event_list').append(append_model);

            });

        }

    });
  
}