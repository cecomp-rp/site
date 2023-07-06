var news_remove_page = 1;

$("document").ready(function() {

    news_remove_list(news_remove_page);

});

function news_remove_list(page){
    
    common_fetch("/api/news/by_page/" + page , "GET", {}, ['news_remove_message']).then((data) => {

        if(data){
            data.forEach(element => {

                var item_template = 
                `
                <div id=${element._id}>
                    <p class="news_remove_title">Title: ${element.title}</p>
                    <p class="news_remove_description">Description: ${element.description}</p>
                    <p class="news_remove_id">ID: ${element._id}</p>
                    <p class="news_remove_author_id">Author: ${element.author_id}</p>
                    <p class="news_remove_createdAt">Created At: ${element.createdAt}</p>
                    <p class="news_remove_updatedAt">Updated At: ${element.updatedAt}</p>
                    <a href="/news/${element._id}">Read more...</a>
                    <button onclick="news_remove_delete('${element._id}')">Delete</button>
                    <button onclick="news_remove_edit('${element._id}')">Edit</button>
                </div>
                `;	

                $("#news_remove_div").append(item_template);

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