$('document').ready(function () {
 
    var id = get_last_param_from_URL()

    fetch("/api/news/by_id/" + id)
    .then((response) => {
        return response.json()
    })

    .then((news) => {
        console.log(news)
        $("#news_title").text(news.title)
        $("#news_description").text(news.description)

        $("#news_content").append(news.content)

        $("#news_create_date").text(news.createdAt)
        $("#news_update_date").text(news.updatedAt)
        $("#news_author").text(news.author_id)
    })  

    .catch((error) => {
        console.log(error)
    })

})

function get_last_param_from_URL(){
    let url = window.location.href
    let url_array = url.split("/")
    let last_param = url_array[url_array.length - 1]
    return last_param
}