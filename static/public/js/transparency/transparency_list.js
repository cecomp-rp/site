var transparency_list_page = 1;

$(document).ready(function(){

    transparency_list_list(transparency_list_page);

});

function transparency_list_list(page){

    common_fetch("/api/transparency/item/" + page, "GET" ).then((data) => {

        if(data){

            data.forEach(element => {

                common_append("#transparency_list_div", "transp_transparency.html", element);

            });

        }

    });

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