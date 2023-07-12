var role_update_user_roles = [];

$('document').ready(function () {

    $('#role_update_email').on('input', function () {
        role_update_list();
    });

});

function role_update_list(){

    if($('#role_update_email').val()){
        common_fetch('/api/roles/' + $('#role_update_email').val(), 'GET', {}, ['role_update_msg'])
        .then((data) => {

            if(data){
                $('#role_update_current_roles').text(data.roles.join(' | '));
                role_update_user_roles = data.roles;
            }else{
                $('#role_update_current_roles').text(''); 
                role_update_user_roles = [];
            }

        })
    }

}

function role_update_add(){
    var role = $('#role_update_select').val();
    role_update_user_roles.push(role);

    //Remove repeated roles
    role_update_user_roles = [...new Set(role_update_user_roles)];

    role_update_submit();
}

function role_update_remove(){
    var role = $('#role_update_select').val();
    role_update_user_roles.splice(role_update_user_roles.indexOf(role), 1);

    //Remove repeated roles
    role_update_user_roles = [...new Set(role_update_user_roles)];

    role_update_submit();
}

function role_update_submit(){

    common_fetch('/api/roles/' + $('#role_update_email').val(), 'PATCH', role_update_user_roles, ['role_update_msg2'])
    .then((data) => {

        role_update_list();

    })

}



