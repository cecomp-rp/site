var news_edit_editor_clipboard;
var news_edit_editor;

$(document).ready(function() {
    
    //Quill Editor
    var options = {
        modules: {
            'syntax': true,
            'toolbar': [
              [ 'bold', 'italic', 'underline', 'strike' ],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'script': 'super' }, { 'script': 'sub' }],
              [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block' ],
              [{ 'list': 'ordered' }, { 'list': 'bullet'}, { 'indent': '-1' }, { 'indent': '+1' }],
              [ 'direction', { 'align': [] }],
              [ 'link', 'image', 'video', 'formula' ],
              [ 'clean' ]
        ]
        },
        placeholder: 'Dream here...',
        theme: 'snow'
      };

    news_edit_editor = new Quill('#news_edit_editor', options);
    news_edit_editor_clipboard = news_edit_editor.getModule('clipboard');

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
        var content         = news_edit_editor.root.innerHTML;

        var data = {
            title: title,
            description: description,
            content: content,
        }

        console.log(data)

        fetch("/api/news/" + id, {
            method: "PATCH",
            cache: "default",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }).then((response) => {
                
                if(response.status == 200){
                    $("#news_edit_message").text("News updated successfully.");
                }else{
                    $("#news_edit_message").text("Could not update news.");
                }
    
            }
        ).catch((err) => {
            console.log(err)
        })

    }); 

});



function news_edit_fetch(id){
    $("#news_edit_title").val("");
    $("#news_edit_description").val("");
    news_edit_editor.setContents([]);

    fetch("/api/news/by_id/" + id , {
        method: "GET",
        cache: "default", 
        headers: {
            "Content-Type": "application/json",
        }

    }).then((response) => {
        
        if(response.status == 200){
        
            response.json().then((data) => {

                $("#news_edit_title").val(data.title);
                $("#news_edit_description").val(data.description);
                news_edit_editor_clipboard.dangerouslyPasteHTML(0, data.content);

                $("#news_edit_fetch_message").text("");

            })

        }else{
            $("#news_edit_fetch_message").text("Could not fetch news with this id.");
        }

    }).catch((err) => {
        console.log(err)
    })

}
