var transparency_remove_page = 1;

$(document).ready(function(){

    transparency_remove_list(transparency_remove_page);

});

function transparency_remove_list(page){

    fetch("/api/transparency/item/" + page , {
        method: "GET",
        cache: "default", 
        headers: {
            "Content-Type": "application/json",
        }

    }).then((response) => {response.json().then((data) => {
           
        data.forEach(element => {

            var item_template = 
            `
            <div id=${element._id}>
                <p id="transparency_remove_title">Title: ${element.title}</p>
                <p id="transparency_remove_description">Description: ${element.description}</p>
                <p id="transparency_remove_value">Value: ${element.value}</p>
                <p id="transparency_remove_dateOfTransaction">Date Of Transaction: ${element.dateOfTransaction}</p>
                <p id="transparency_remove_dateOfTransaction">Date Of Addition: ${element.createdAt}</p>
                <p id="transparency_remove_dateOfTransaction">Date Of Last Modification: ${element.updatedAt}</p>
                <p id="transparency_remove_id">ID: ${element._id}</p>
                <button onclick="transparency_remove_delete('${element._id}')">Delete</button>
            </div>
            `;	

            $("#transparency_remove_div").append(item_template);

        });


    })}).catch((err) => {
        console.log(err)
    })

}

function transparency_remove_delete(id){

    fetch("/api/transparency/item/" + id, {
        method: "DELETE",
        cache: "default", 
        headers: {
            "Content-Type": "application/json",
        }

    }).then((response) =>{

        if(response.status == 200){
            $("#" + id).remove();
        }else{
            alert("Error deleting item!");
        }
        
    }).catch((err) => {
        console.log(err)
    })

}

function transparency_remove_next_page(){
    transparency_remove_page++; 

    $("#transparency_remove_div").empty();
    $("#transparency_remove_page_display").text(transparency_remove_page);
    transparency_remove_list(transparency_remove_page);
}

function transparency_remove_previous_page(){
    if((transparency_remove_page-1)<=0){return;}
    
    transparency_remove_page--; 

    $("#transparency_remove_div").empty();
    $("#transparency_remove_page_display").text(transparency_remove_page);
    transparency_remove_list(transparency_remove_page);

}