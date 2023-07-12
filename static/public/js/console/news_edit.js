var news_edit_editor;

$(document).ready(function() {
    
    news_edit_editor = common_quill_createEditor('#news_edit_editor');

    //Fetch news by ID
    $("#news_edit_id").on('input', function(){
        var id = $("#news_edit_id").val();
        news_edit_fetch(id);
    });

    //Submit updates
    $("#news_edit_submit").click(function(){
        
        var id              = $("#news_edit_id").val();
        var title           = $("#news_edit_title").val();
        var description     = $("#news_edit_description").val();
        var content         = common_quill_getContent(news_edit_editor);

        var data = {
            title: title,
            description: description,
            content: content,
        }

        common_fetch("/api/news/" + id, "PATCH", data, ['news_edit_message'])

    }); 

});

function news_edit_fetch(id){
    $("#news_edit_title").val("");
    $("#news_edit_description").val("");
    common_quill_clearContent(news_edit_editor);

    common_fetch("/api/news/by_id/" + id, "GET", {}, ['news_edit_fetch_message']).then((data) => {

        if(data){
            $("#news_edit_title").val(data.title);
            $("#news_edit_description").val(data.description);
            common_quill_setContent(news_edit_editor, data.content);
        }

    })

}

