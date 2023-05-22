var poll_remove_page = 1;

$('document').ready(function(){

    poll_remove_list(poll_remove_page)

});

function poll_remove_list(poll_remove_page){

    fetch('/api/polls/by_page/' + poll_remove_page)
    .then((response) => {
        return response.json()
    }).then((polls) => {
        console.log(polls)

        polls.forEach(element => {

            var append_model = 
            `
            <div id="${element._id}">
                <p>ID: ${element._id}</p>
                <p>Title: ${element.title}</p>
                <p>Description: ${element.description}</p>
                <p>Author: ${element.author_id}</p>
                <p>End Date: ${element.endDate}</p>
                <p>Created At: ${element.createdAt}</p>
                <div id="${element._id}_poll_options"></div>

                <a href="/polls/${element._id}">See more</a>
                <button onclick="poll_remove_delete('${element._id}')">Delete</button>
            </div>
            
            `;

            $('#poll_remove_div').append(append_model);

            element.options.forEach((option, i) => {

                var append_model_options = 
                `
                <div id="${element._id}_${i}_option">
                    <p>Option ${i})</p>
                    <div id="${element._id}_${i}_content">${option.content}</div>
                    <p id="${element._id}_${i}_vote_count">${option.numberOfVotes}</p>
                </div>
                `;

                $(`#${element._id}_poll_options`).append(append_model_options);

            });


            
        });

    }).catch((error) => {
        console.log(error)
    })

}

function poll_remove_delete(id){

    fetch('/api/polls/' + id, {
        method: 'DELETE'
    }).then((response) => {
        
        if(response.status == 200){
            $(`#${id}`).remove();
        }else{
            console.log(response.status)
        }

    }).catch((error) => {
        console.log(error)
    })
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
