var email_fetch_atv_page = 1;

$(document).ready(function(){

    $('#email_fetch_atv_id').on('input', function(){
        email_fetch_atv_list(email_fetch_atv_page);
    })

})

function email_fetch_atv_list(page){
    
    const id = $('#email_fetch_atv_id').val();

    $("#email_fetch_atv_div").empty();

    const filters = {
        role: $('#email_fetch_atv_filter_role').val(),
    }

    const data = {
        filters
    }

    common_fetch('/api/emails/actv/' + id + '/' + page, 'POST', data, ['email_fetch_atv_msg']).then((data) => {

        if(data){

            data.forEach((email) => {

                common_append('#email_fetch_atv_div', 'con_email.html', email);

            })

        }

    })

}

function email_fetch_atv_next_page(){
    email_fetch_atv_page++; 

    $("#email_fetch_atv_div").empty();
    $("#email_fetch_atv_page_display").text(email_fetch_atv_page);
    email_fetch_atv_list(email_fetch_atv_page);
}

function email_fetch_atv_previous_page(){
    if((email_fetch_atv_page-1)<=0){return;}
    
    email_fetch_atv_page--; 

    $("#email_fetch_atv_div").empty();
    $("#email_fetch_atv_page_display").text(email_fetch_atv_page);
    email_fetch_atv_list(email_fetch_atv_page);

}