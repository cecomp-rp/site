var email_fetch_global_page = 1;

$(document).ready(function(){

    email_fetch_global_list(email_fetch_global_page);

    $('#email_fetch_global_filter_role').change(function(){
        email_fetch_global_list(email_fetch_global_page);
    })

})

function email_fetch_global_list(page){
    
    $("#email_fetch_global_div").empty();

    const filters = {
        role: $('#email_fetch_global_filter_role').val(),
    }

    common_fetch('/api/emails/global/' + page, 'POST', {filters}).then((data) => {

        if(data){

            data.forEach((email) => {

                common_append('#email_fetch_global_div', 'con_email.html', email);

            })

        }

    })

}

function email_fetch_global_next_page(){
    email_fetch_global_page++; 

    $("#email_fetch_global_div").empty();
    $("#email_fetch_global_page_display").text(email_fetch_global_page);
    email_fetch_global_list(email_fetch_global_page);
}

function email_fetch_global_previous_page(){
    if((email_fetch_global_page-1)<=0){return;}
    
    email_fetch_global_page--; 

    $("#email_fetch_global_div").empty();
    $("#email_fetch_global_page_display").text(email_fetch_global_page);
    email_fetch_global_list(email_fetch_global_page);

}