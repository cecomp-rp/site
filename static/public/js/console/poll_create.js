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

//Startup
$('document').ready(function() {
    
    $("#poll_create_submit").click(function(){
        poll_create_submit()
    });

})

var poll_create_editors = [];

//Functions
function poll_create_add_option(){
    var uniq = 'id' + (new Date()).getTime() + parseInt(Math.random() * 1000);

    var append_model = 
    `
    <div id="${uniq}" class="poll_create_option">
        <div id="${uniq}_editor"></div>
        <button class="poll_create_remove_option" onclick="poll_create_remove_option('${uniq}')">Remove</button>
    </div>
    `;

    $('#poll_create_options').append(append_model)

    var new_editor = new Quill('#'+uniq+'_editor', options);
    poll_create_editors.push({
        id:     uniq,
        editor: new_editor
    })

}

function poll_create_remove_option(id){

    $(`#${id}`).remove()

    poll_create_editors = poll_create_editors.filter(function( obj ) {
        return obj.id !== id;
    });

}

function poll_create_submit(){

    var title           = $("#poll_create_title").val();
    var description     = $("#poll_create_description").val();
    var endDate         = $("#poll_create_end_date").val();

    var options = [];
    for(var i = 0; i < poll_create_editors.length; i++){
        options.push({
            content: poll_create_editors[i].editor.root.innerHTML,
            numberOfVotes: 0
        })
    }

    var data = {
        title,
        description,
        options,
        endDate
    }

    common_fetch('/api/polls', 'POST', data, ['poll_create_message'])

}