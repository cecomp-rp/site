$(document).ready(function() {
  
    var news_create_editor = common_quill_createEditor('#news_create_content');

    //Submit news
    $("#news_create_submit").click(function(){
        
        var title           = $("#news_create_title").val();
        var description     = $("#news_create_description").val();
        var content         = common_quill_getContent(news_create_editor);

        var data = {
            title: title,
            description: description,
            content: content,
        }

        common_fetch("/api/news", "POST", data, ['news_create_message'])

    }); 

});

