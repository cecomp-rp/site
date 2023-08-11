$(document).ready(function() {
    common_isLogged();
});

function common_date_unixToISO(date){
    return new Date(date).toISOString().split('.')[0];
}

function common_date_ISOToUnix(date){
    return new Date(date).getTime();
}

function common_URL_get_last_param(){
    let url = window.location.href
    let url_array = url.split("/")
    let last_param = url_array[url_array.length - 1]
    return last_param
}

function common_fetch(url, method, data = {}, msg_objs = []){

    var opts = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    switch(method){
        case 'GET':
            opts.body = undefined;
            break;
        case 'POST':
            break;
        case 'PATCH':
            break;
        case 'DELETE':
            break;
        default:
            console.log("Error: invalid method");
            return undefined;
    }

    return fetch(url, opts)
    .then((response) => {

        //There is a response json
        if(response.status == 200 || response.status == 400){
            return response.json().then((data) => {

                //Warning set?
                if(data.warning){
                    common_fetch_warning_aux(data.warning)
                }

                //Redirect set?
                if(data.redirect){
                    window.location.href = data.redirect;
                }

                //200 - OK
                if(response.status == 200){
                    msg_objs.forEach((msg_obj) => {
                        $('#' + msg_obj).show();
                        $('#' + msg_obj).attr('class', 'box-2');
                        $('#' + msg_obj).text(data.message);
                    })
                    return data.content;
                }

                //400 - Error
                else if(response.status == 400){
                    console.log("Error: " + data.error);
                    msg_objs.forEach((msg_obj) => {
                        $('#' + msg_obj).show();
                        $('#' + msg_obj).attr('class', 'box-4');
                        $('#' + msg_obj).text(data.error);
                    })
                    return undefined;
                }

            }).catch((error) => {
                    //Erro de JSON
                    msg_objs.forEach((msg_obj) => {
                        $('#' + msg_obj).show();
                        $('#' + msg_obj).attr('class', 'box-4');
                        $('#' + msg_obj).text('Erro!');
                    })
                    return undefined;
            });
        
        }
        
        //There is no response json
        else{
            msg_objs.forEach((msg_obj) => {
                $('#' + msg_obj).text('Erro!');
            })
            return undefined;
        }

 
    }).catch((error) => {
        //Erro desconhecido
        console.log(error);
        msg_objs.forEach((msg_obj) => {
            $('#' + msg_obj).text('Erro!');
        })
        return undefined;
    });

}

function common_fetch_warning(id) {
    return common_fetch("/api/warning/" + id, "GET")
}

function common_fetch_warning_aux(id){
    common_fetch_warning(id).then((data) => {
        if(data){
            //Call a warning
            common_warning_open(data);
        }
    })
}

function common_append(where_to_append, file_to_append, attr_to_add = {}){

    return $.get("/append/" + file_to_append, function(data) {

        data = common_replaceAttr(data, attr_to_add);
        data = common_replaceRemainingAttr(data);

        //If $(where_to_append) is an id, append to the element with that id
        if(where_to_append[0] == '#'){
            $(where_to_append).append(data);
        }

        //If $(where_to_append) is a class or general tag, append to all elements with that class
        else{
            $(where_to_append).each(function(i){
                $(this).append(data);
            })
        }

        //Extras
        common_format_dates();

    })

}

function common_replaceAttr(html, attr_to_add){

    const regex = /\${(.*?)}/g; //Matches ${anything}
    
    for(var attr in attr_to_add){
        
        //Not obj and not array
        if(typeof attr_to_add[attr] != 'object' && !Array.isArray(attr_to_add[attr])){
            html = html.replace(regex, function(match, p1, offset, string) {
                if(p1 == attr){
                    return attr_to_add[attr];
                }
                else{
                    return match;
                }
            });

        }

        //Is it array?
        else if(Array.isArray(attr_to_add[attr])){
            //Do nothing
            continue;
        }

        //Is it object?
        else if(typeof attr_to_add[attr] == 'object'){

            var mod_html = html.replace(regex, function(match, p1, offset, string) {

                //Remove attr + dot from p1
                if (p1.includes(attr + '.')){
                    return "${" + p1.replace(attr + '.', '') + "}";
                }
                else{
                    return match;
                }

            });

            html = common_replaceAttr(mod_html, attr_to_add[attr]);
    
        }
       
    }

    return html;
}

function common_replaceRemainingAttr(html){

    const regex = /\${(.*?)}/g; //Matches ${anything}
    var mod_html = html.replace(regex, '-')

    return mod_html;

}

function common_isLogged(){
    common_fetch('/api/account', 'GET').then((data) => {
    
        if(data){
            $('.logged').show();
            $('.notlogged').hide();
        }else{
            $('.logged').hide();
            $('.notlogged').show();
        }

    })

}

function common_goBack(){

    

    if(document.referrer){
        location.href = document.referrer;
    }

    if(common_cookie_get('redirect')){
        location.href = common_cookie_get('redirect');
    }

    else {
        location.href = '/';
    }

}

$(document).ready(function() {
    console.log(common_cookie_get('redirect'))
});
