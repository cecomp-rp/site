$('document').ready(function () {
 
    const id = common_URL_get_last_param()

    common_fetch("/api/news/by_id/" + id, "GET").then((data) => {

        if(data){

            $("#news_title").text(data.title)
            $("#news_description").text(data.description)
            
            $("#news_content").html(data.content)

            $("#news_create_date").text(data.created_at)
            $("#news_update_date").text(data.updated_at)
            $("#news_author").text(data.author_id)
        
            common_format_dates();

        }else{
            common_cookieWarning_set("newsNotFound")
            window.location.href = "/"
        }

    })

})
