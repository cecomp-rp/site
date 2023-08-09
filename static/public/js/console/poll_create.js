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

    common_append('#poll_create_options', 'con_poll_opt.html', {uniq}).then(() => {

        var new_editor = common_quill_createEditor('#' + uniq +'_editor')
        
        poll_create_editors.push({
            id:     uniq,
            editor: new_editor
        })

    });

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
    var startDate       = $("#poll_create_start_date").val();
    var endDate         = $("#poll_create_end_date").val();

    var options = [];
    for(var i = 0; i < poll_create_editors.length; i++){
        options.push({
            content: common_quill_getContent(poll_create_editors[i].editor),
            numberOfVotes: 0
        })
    }

    var data = {
        title,
        description,
        options,
        startDate: common_date_ISOToUnix(startDate),
        endDate: common_date_ISOToUnix(endDate)
    }

    common_fetch('/api/polls', 'POST', data, ['poll_create_message'])

}