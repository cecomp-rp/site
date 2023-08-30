$('document').ready(function() {

    sub_event_list_load();
});

function sub_event_list_load(){

    common_fetch("/api/sub/", "GET", {}, []).then((data) => {

        if(data){

            data.forEach(function(event) {

                event.description = common_quill_pasteContent('', event.description);

                common_append('#sub_event_list', 'sub_event.html', event);

            });

        }

    });
  
}