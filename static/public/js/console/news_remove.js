var news_remove_page = 1;

$("document").ready(function() {

    news_remove_list(news_remove_page);

});

function news_remove_list(page){
    
    common_fetch("/api/news/by_page/" + page , "GET", {}, ['news_remove_message']).then((data) => {

        if(data){
            data.forEach(element => {

                common_append("#news_remove_div", "con_news.html", element);

            });
        }

    })

}

function news_remove_delete(id){

    common_fetch("/api/news/" + id, "DELETE", {}, ['news_remove_message']).then((data) => {

        if(data){
            $("#" + id).remove();
            $("#news_remove_div").empty();
            news_remove_list(news_remove_page);
        }else{
            alert("Error deleting item!");
        }
    
    })

}

function news_remove_edit(id){
    $("#news_edit_id").val(id);
    news_edit_fetch(id);

}

function news_remove_next_page(){
    news_remove_page++; 

    $("#news_remove_div").empty();
    $("#news_remove_page_display").text(news_remove_page);
    news_remove_list(news_remove_page);
}

function news_remove_previous_page(){
    if((news_remove_page-1)<=0){return;}
    
    news_remove_page--; 

    $("#news_remove_div").empty();
    $("#news_remove_page_display").text(news_remove_page);
    news_remove_list(news_remove_page);

}