var transparency_remove_page = 1;

$(document).ready(function(){

    transparency_remove_list(transparency_remove_page);

});

function transparency_remove_list(page){

    common_fetch("/api/transparency/item/" + page, "GET").then((data) => {

        if(data){

            data.forEach(element => {

                common_append("#transparency_remove_div", "con_transparency.html", element);
    
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