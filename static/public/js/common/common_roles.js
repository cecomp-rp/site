$(document).ready(function() {
    common_roles_fetch();
})

function common_roles_fetch() {
    
    common_fetch('/api/roles', 'GET', {}, ['msg_roles_fetch'])
    .then((data) => {

        if(data){

            $('.load-roles').each(function(i){

                data.forEach((role) => {

                    var append_model = `
                    <option value="${role.name}">${role.name}</option>
                    `;

                    $(this).append(append_model);

                })

            })

        }

    })
}