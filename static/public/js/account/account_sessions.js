var acc_session_page = 1;

$('document').ready(function() {
    acc_session_fetch(acc_session_page);
});

function acc_session_fetch(acc_session_page){

    common_fetch('/api/session/' + acc_session_page, 'GET', {}, []).then((data) => {

        if(data){

            $('#acc_session_other').empty();
            $('#acc_session_current').empty();

            //Current session
            $("#acc_session_current_machine").text(data.current.machine);
            $("#acc_session_current_os").text(data.current.os);
            $("#acc_session_current_ip").text(data.current.ip);

            //Other sessions
            data.other.forEach(element => {
                common_append('#acc_session_other', 'acc_session.html', element);
            });

        }

    })

}

function acc_session_next_page(){
    acc_session_page++; 

    $("#acc_session_page_display").text(acc_session_page);
    acc_session_fetch(acc_session_page);
}

function acc_session_previous_page(){
    if((acc_session_page-1)<=0){return;}
    
    acc_session_page--; 

    $("#acc_session_page_display").text(acc_session_page);
    acc_session_fetch(acc_session_page);

}

function acc_session_delete_all(){

    common_fetch('/api/session/all', 'DELETE', {}, []).then((data) => {

        if(data){
            location.reload();
        }else{
            alert("Error!");
        }
    
    })
}

function acc_session_delete_one(id){

    common_fetch('/api/session/by_id/' + id, 'DELETE', {}, []).then((data) => {

        if(data){
            $("#" + id).remove();
            acc_session_fetch(acc_session_page);
        }else{
            alert("Error!");
        }

    })

}