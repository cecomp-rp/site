$('document').ready(function() {

    var event_name = get_last_param_from_URL();

    isSubscribed(event_name).then(function(result) {

        if(result){
            $('#sub_your_activities').show();
            sub_your_activities_load(event_name);
        }
            
    })

});

function sub_your_activities_load(event_name){

    common_fetch('/api/actv/' + event_name, 'GET').then((data) => {

        if(data){

            data.forEach(function(actv) {

                var append_model = 
                `
                <p>${actv.title}</p>
                <p>${actv.description}</p>
                <br>
                `;

                $('#sub_actv_list').append(append_model);

            });

        }

    });

}
