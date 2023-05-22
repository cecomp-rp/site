var poll_id = get_last_param_from_URL()

$('document').ready(function () {
 
    fetch("/api/polls/by_id/" + poll_id)
    .then((response) => {
        return response.json()
    })
    .then((poll) => {
    
        $('#poll_title').text(poll.title)
        $('#poll_description').text(poll.description)
        $('#poll_author').text(poll.author_id)
        $('#poll_end_date').text(poll.endDate)
        $('#poll_start_date').text(poll.createdAt)

        poll.options.forEach((option) => {

            var append_model =
            `
            <div id="${option._id}">
                <div>${option.content}</div>
                <p id="${option._id}_counter">${option.numberOfVotes}</p>
                <button class="${poll._id}_button" onclick="poll_vote('${option._id}')">Vote</button>
            </div>
            `;

            $('#poll_options').append(append_model)

        })

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

    })
})

function get_last_param_from_URL(){
    let url = window.location.href
    let url_array = url.split("/")
    let last_param = url_array[url_array.length - 1]
    return last_param
}

function poll_vote(option_id){

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

