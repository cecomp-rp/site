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

                //200 - OK
                if(response.status == 200){
                    msg_objs.forEach((msg_obj) => {
                        $('#' + msg_obj).text(data.message);
                    })
                    return data.content;
                }

                //400 - Error
                else if(response.status == 400){
                    console.log("Error: " + data.error);
                    msg_objs.forEach((msg_obj) => {
                        $('#' + msg_obj).text(data.error);
                    })
                    return undefined;
                }

            }).catch((error) => {
                    //Erro de JSON
                    console.log(error);
                    msg_objs.forEach((msg_obj) => {
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

function common_append(where_to_append, file_to_append, attr_to_add = {}){

    const regex = /{{(.*?)}}/g;

    $.get("\append/" + file_to_append, function(data) {

        //Replace all {{attr}} with attr_to_add[attr]
        data = data.replace(regex, function(match, capture) {
            return attr_to_add[capture];
        });

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

    })

}