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


    var news_create_editor = new Quill('#news_create_editor', options);


    //Submit news
    $("#news_create_submit").click(function(){
        
        var title           = $("#news_create_title").val();
        var description     = $("#news_create_description").val();
        var content         = news_create_editor.root.innerHTML;

        var data = {
            title: title,
            description: description,
            content: content,
        }

        fetch("/api/news", {
            method: "POST",
            cache: "default", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data), 

        }).then((response) => {

            if(response.status == 201) {
                $('#news_create_message').text("Success!")
            } else {
                $('#news_create_message').text("News creation failed!")
            }

        }).catch((err) => {
            console.log(err)
        })

    }); 

});

