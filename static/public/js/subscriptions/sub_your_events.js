$('document').ready(function() {

    sub_event_list_load();
});

function sub_event_list_load(){

    fetch("/api/sub/", {

        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }

    }).then(function(response) {

        response.json().then(function(data) {

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

        });

    }).catch(function(err) {

        console.log(err);

    });
    
        
}