var transparency_list_page = 1;

$(document).ready(function(){

    transparency_list_list(transparency_list_page);

});

function transparency_list_list(page){

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
                <p id="transparency_list_title">Title: ${element.title}</p>
                <p id="transparency_list_description">Description: ${element.description}</p>
                <p id="transparency_list_value">Value: ${element.value}</p>
                <p id="transparency_list_dateOfTransaction">Date Of Transaction: ${element.dateOfTransaction}</p>
                <p id="transparency_list_dateOfTransaction">Date Of Addition: ${element.createdAt}</p>
                <p id="transparency_list_dateOfTransaction">Date Of Last Modification: ${element.updatedAt}</p>
                <p id="transparency_list_id">ID: ${element._id}</p>
            </div>
            `;	

            $("#transparency_list_div").append(item_template);

        });


    })}).catch((err) => {
        console.log(err)
    })

}

function transparency_list_next_page(){
    transparency_list_page++; 

    $("#transparency_list_div").empty();
    $("#transparency_list_page_display").text(transparency_list_page);
    transparency_list_list(transparency_list_page);
}

function transparency_list_previous_page(){
    if((transparency_list_page-1)<=0){return;}
    
    transparency_list_page--; 

    $("#transparency_list_div").empty();
    $("#transparency_list_page_display").text(transparency_list_page);
    transparency_list_list(transparency_list_page);

}