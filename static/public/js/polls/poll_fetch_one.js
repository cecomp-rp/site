var poll_id = common_URL_get_last_param()

$('document').ready(function () {
 
    common_fetch('/api/polls/by_id/' + poll_id, 'GET').then((data) => {

        if(data) {

            $('#poll_title').text(data.title)
            $('#poll_description').text(data.description)
            $('#poll_author').text(data.author_id)
            $('#poll_end_date').text(data.endDate)
            $('#poll_start_date').text(data.startDate)
            $('#poll_created_at').text(data.created_at)

            data.options.forEach((option) => {

                common_append('#poll_options', 'poll_opt.html', {poll: data, option}).then(() => {

                     //User already voted?
                    if(data.alreadyVoted == true){
                        $('.' + data._id + '_button').attr("disabled", true);
                        $('.' + data._id + '_button').text("Already voted");
                    }

                    //Poll out of date?
                    if(data.endDate < Date.now()){
                        $('.' + data._id + '_button').attr("disabled", true);
                        $('.' + data._id + '_button').text("Poll out of date");
                    }

                    //Poll not open yet?
                    if(data.startDate > Date.now()){
                        $('.' + data._id + '_button').attr("disabled", true);
                        $('.' + data._id + '_button').text("Poll not open yet");
                    }
                
                })

            })

        }  
    
    })

})

function poll_vote(option_id){

    common_fetch('/api/polls/vote/' + poll_id, 'POST', { option: option_id }).then((data) => {

        if(data){
            $('.' + poll_id + '_button').attr("disabled", true);
            $('.' + poll_id + '_button').text("Already voted");
            $('#' + option_id + '_counter').text(parseInt($('#' + option_id + '_counter').text()) + 1)
        }

    })

}

