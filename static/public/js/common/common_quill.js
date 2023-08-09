function common_quill_createEditor(div){

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

    var uniq = 'id' + (new Date()).getTime() + parseInt(Math.random() * 1000);

    $(div).append(`
    <div id=${uniq} class='editor'></div>
    `)

    var editor = new Quill(`#${uniq}`, options);
    
    return editor;
  
}

function common_quill_getContent(editor){
    return editor.root.innerHTML;
}

function common_quill_setContent(editor, content){
    var clipboard = editor.getModule('clipboard');
    clipboard.dangerouslyPasteHTML(content);
}

function common_quill_clearContent(editor){
    editor.setText('');
}

