var acc_session_page = 1;

$('document').ready(function() {
    acc_session_fetch(acc_session_page);
});

function acc_session_fetch(acc_session_page){

    fetch('/api/session/' + acc_session_page, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        if(res.status === 200){
            res.json().then((data) => {
                
                $('#acc_session_other').empty();
                $('#acc_session_current').empty();

                //Current session
                $("#acc_session_current_machine").text(data.current.machine);
                $("#acc_session_current_os").text(data.current.os);
                $("#acc_session_current_ip").text(data.current.ip);

                //Other sessions
                data.other.forEach(element => {
                    var append_model = `
                    <div id="${element._id}">
                        <p>${element.machine}</p>
                        <p>${element.os}</p>
                        <p>${element.ip}</p>
                        <button onclick="acc_session_delete_one('${element._id}')">Delete</button>
                    </div>
                
                    `;

                    $('#acc_session_other').append(append_model);
                });

            })
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

    fetch("/api/session/all", {
        method: "DELETE",
        cache: "default",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {

        if(response.status == 200){
            //reload page
            location.reload();
        }else{ 
            alert("Error!");
        }
        
    }).catch((err) => {

        console.log(err)

    })



}

function acc_session_delete_one(id){

    fetch("/api/session/by_id/" + id, {
        method: "DELETE",
        cache: "default",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {

        if(response.status == 200){
            $("#" + id).remove();
            acc_session_fetch(acc_session_page);
        }else{
            alert("Error deleting item!");
        }
        
    }).catch((err) => {

        console.log(err)

    })

}