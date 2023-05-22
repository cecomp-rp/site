var poll_fetch_page = 1;

$('document').ready(function(){

    poll_fetch_list(poll_fetch_page)

});

function poll_fetch_list(poll_fetch_page){

    fetch('/api/polls/by_page/' + poll_fetch_page)
    .then((response) => {
        return response.json()
    }).then((polls) => {

        polls.forEach(poll => {

            var append_model = 
            `
            <div id="${poll._id}">
                <p>Title: ${poll.title}</p>
                <p>Description: ${poll.description}</p>
                <p>Author: ${poll.author_id}</p>
                <p>End Date: ${poll.endDate}</p>
                <p>Created At: ${poll.createdAt}</p>
                <div id="${poll._id}_poll_options"></div>

                <a href="/polls/${poll._id}">See page...</a>
            </div>
            
            `;

            $('#poll_fetch_div').append(append_model);

            poll.options.forEach((option, i) => {

                var append_model_options = 
                `
                <div id="${option._id}">
                    <div>${option.content}</div>
                    <p id="${option._id}_counter">${option.numberOfVotes}</p>
                    <button class="${poll._id}_button" onclick="poll_vote('${option._id}','${poll._id}')">Vote</button>
                </div>
                `;

                $(`#${poll._id}_poll_options`).append(append_model_options);

            });

            //User already voted?
            if(poll.alreadyVoted == true){
                $('.' + poll._id + '_button').attr("disabled", true);
                $('.' + poll._id + '_button').text("Already voted");
            }

            //Poll out of date?
            var poll_date = Date.parse(poll.endDate);
            if(poll_date < Date.now()){
                $('.' + poll._id + '_button').attr("disabled", true);
                $('.' + poll._id + '_button').text("Poll out of date");
            }

            
        });

    }).catch((error) => {
        console.log(error)
    })

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

    fetch("/api/polls/vote/" + poll_id, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ option: option_id })
    })
    .then((response) => {
        if(response.status == 200){
            $('.' + poll_id + '_button').attr("disabled", true);
            $('.' + poll_id + '_button').text("Already voted");
            $('#' + option_id + '_counter').text(parseInt($('#' + option_id + '_counter').text()) + 1)
        }
    })

}