var poll_remove_page = 1;

$('document').ready(function(){

    poll_remove_list(poll_remove_page)

});

function poll_remove_list(poll_remove_page){

    common_fetch('/api/polls/by_page/' + poll_remove_page, 'GET').then((data) => {

        if(data){

            data.forEach(element => {

                common_append('#poll_remove_div', 'con_poll.html', element).then(() => {
    
                    element.options.forEach((option, i) => {

                        common_append(`#${element._id}_poll_options`, 'con_poll_opt2.html', {element, option, i})
        
                    });

                });

            });

        }

    });

}

function poll_remove_delete(id){

    common_fetch('/api/polls/' + id, 'DELETE').then((data) => {

        if(data){
            $(`#${id}`).remove();
            $("#poll_remove_div").empty();
            poll_remove_list(poll_remove_page);
        }

    });

}

function poll_remove_next_page(){
    poll_remove_page++; 

    $("#poll_remove_div").empty();
    $("#poll_remove_page_display").text(poll_remove_page);
    poll_remove_list(poll_remove_page);
}

function poll_remove_previous_page(){
    if((poll_remove_page-1)<=0){return;}
    
    poll_remove_page--; 

    $("#poll_remove_div").empty();
    $("#poll_remove_page_display").text(poll_remove_page);
    poll_remove_list(poll_remove_page);

}
