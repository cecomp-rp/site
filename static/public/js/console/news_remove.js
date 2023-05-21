var news_remove_page = 1;

$("document").ready(function() {

    news_remove_list(news_remove_page);

});

function news_remove_list(page){
    
    fetch("/api/news/by_page/" + page , {
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

    })}).catch((err) => {
        console.log(err)
    })

}

function news_remove_delete(id){

    fetch("/api/news/" + id, {
        method: "DELETE",
        cache: "default", 
        headers: {
            "Content-Type": "application/json",
        }

    }).then((response) =>{

        if(response.status == 200){
            $("#" + id).remove();
            $("#news_remove_div").empty();
            news_remove_list(news_remove_page);
        }else{
            alert("Error deleting item!");
        }
        
    }).catch((err) => {
        console.log(err)
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