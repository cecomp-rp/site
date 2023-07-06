var news_list_page = 1;

$("document").ready(function() {

    news_list_list(news_list_page);

});

function news_list_list(page){
    
    common_fetch("/api/news/by_page/" + page , "GET").then((data) => {

        if(data){

            data.forEach(element => {

                var item_template = 
                `
                <div id=${element._id}>
                    <p class="news_list_title">Title: ${element.title}</p>
                    <p class="news_list_description">Description: ${element.description}</p>
                    <p class="news_list_id">ID: ${element._id}</p>
                    <p class="news_list_author_id">Author: ${element.author_id}</p>
                    <p class="news_list_createdAt">Created At: ${element.createdAt}</p>
                    <p class="news_list_updatedAt">Updated At: ${element.updatedAt}</p>
                    <a href="/news/${element._id}">Read more...</a>
                </div>
                `;	
    
                $("#news_list_div").append(item_template);
    
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
