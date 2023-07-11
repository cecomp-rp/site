var news_list_page = 1;

$("document").ready(function() {

    news_list_list(news_list_page);

});

function news_list_list(page){
    
    common_fetch("/api/news/by_page/" + page , "GET").then((data) => {

        if(data){

            data.forEach(element => {

                common_append("#news_list_div", "index_news.html", element);
    
            });

        }
        
    })

}

function news_list_next_page(){
    news_list_page++; 

    $("#news_list_div").empty();
    $("#news_list_page_display").text(news_list_page);
    news_list_list(news_list_page);
}

function news_list_previous_page(){
    if((news_list_page-1)<=0){return;}
    
    news_list_page--; 

    $("#news_list_div").empty();
    $("#news_list_page_display").text(news_list_page);
    news_list_list(news_list_page);

}
