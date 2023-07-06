var transparency_remove_page = 1;

$(document).ready(function(){

    transparency_remove_list(transparency_remove_page);

});

function transparency_remove_list(page){

    common_fetch("/api/transparency/item/" + page, "GET").then((data) => {

        if(data){

            data.forEach(element => {

                var item_template = 
                `
                <div id=${element._id}>
                    <p class="transparency_remove_title">Title: ${element.title}</p>
                    <p class="transparency_remove_description">Description: ${element.description}</p>
                    <p class="transparency_remove_value">Value: ${element.value}</p>
                    <p class="transparency_remove_dateOfTransaction">Date Of Transaction: ${element.dateOfTransaction}</p>
                    <p class="transparency_remove_dateOfTransaction">Date Of Addition: ${element.createdAt}</p>
                    <p class="transparency_remove_id">ID: ${element._id}</p>
                    <button onclick="transparency_remove_delete('${element._id}')">Delete</button>
                </div>
                `;	
    
                $("#transparency_remove_div").append(item_template);
    
            });
        }
    })

}

function transparency_remove_delete(id){

    common_fetch("/api/transparency/item/" + id, "DELETE").then((data) => {

        if(data){
            $("#" + id).remove();
            $("#transparency_remove_div").empty();
            transparency_remove_list(transparency_remove_page);
        }else{
            alert("Error deleting item!");
        }

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