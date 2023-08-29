var poll_fetch_page = 1;

$('document').ready(function(){

    poll_fetch_list(poll_fetch_page)

});

function poll_fetch_list(poll_fetch_page){

    common_fetch('/api/polls/by_page/' + poll_fetch_page, 'GET').then((data) => {

        if(data){

            data.forEach(poll => {

               common_append('#poll_fetch_div', 'poll_poll.html', poll).then(() => {

                    poll.options.forEach((option, i) => {

                        option.content = common_quill_pasteContent('', option.content);

                        common_append(`#${poll._id}_poll_options`, 'poll_opt.html', {poll, option, i}).then(() => {

                            //User already voted?
                            if(poll.alreadyVoted == true){
                                $('.' + poll._id + '_button').attr("disabled", true);
                                $('.' + poll._id + '_button').text("Already voted");
                            }

                            //Poll out of date?
                            if(poll.endDate < Date.now()){
                                $('.' + poll._id + '_button').attr("disabled", true);
                                $('.' + poll._id + '_button').text("Poll out of date");
                            }

                            //Poll not started yet?
                            if(poll.startDate > Date.now()){
                                $('.' + poll._id + '_button').attr("disabled", true);
                                $('.' + poll._id + '_button').text("Poll not started yet");
                            }

                        });

                    })

               });

            });

        }

    });
}

function poll_fetch_next_page(){
    poll_fetch_page++; 

    $("#poll_fetch_div").empty();
    $("#poll_fetch_page_display").text(poll_fetch_page);
    poll_fetch_list(poll_fetch_page);
}

function poll_fetch_previous_page(){
    if((poll_fetch_page-1)<=0){return;}
    
    poll_fetch_page--; 

    $("#poll_fetch_div").empty();
    $("#poll_fetch_page_display").text(poll_fetch_page);
    poll_fetch_list(poll_fetch_page);

}

function poll_vote(option_id, poll_id){

    common_fetch('/api/polls/vote/' + poll_id, 'POST', {option: option_id}).then((data) => {

        if(data){

            $('.' + poll_id + '_button').attr("disabled", true);
            $('.' + poll_id + '_button').text("Already voted");
            $('#' + option_id + '_counter').text(parseInt($('#' + option_id + '_counter').text()) + 1)

        }

    });

}