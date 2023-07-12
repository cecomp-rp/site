var email_fetch_event_page = 1;

$(document).ready(function(){

    $('#email_fetch_event_id').on('input', function(){
        email_fetch_event_list(email_fetch_event_page);
    })

})

function email_fetch_event_list(page){
    
    const id = $('#email_fetch_event_id').val();

    $("#email_fetch_event_div").empty();

    const filters = {
        role: $('#email_fetch_event_filter_role').val(),
    }

    const data = {
        filters
    }

    common_fetch('/api/emails/event/' + id + '/' + page, 'POST', data, ['email_fetch_event_msg']).then((data) => {

        if(data){

            data.forEach((email) => {

                common_append('#email_fetch_event_div', 'con_email.html', email);

            })

        }

    })

}

function email_fetch_event_next_page(){
    email_fetch_event_page++; 

    $("#email_fetch_event_div").empty();
    $("#email_fetch_event_page_display").text(email_fetch_event_page);
    email_fetch_event_list(email_fetch_event_page);
}

function email_fetch_event_previous_page(){
    if((email_fetch_event_page-1)<=0){return;}
    
    email_fetch_event_page--; 

    $("#email_fetch_event_div").empty();
    $("#email_fetch_event_page_display").text(email_fetch_event_page);
    email_fetch_event_list(email_fetch_event_page);

}