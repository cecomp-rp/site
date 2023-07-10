$(document).ready(function(){

    $('#transparency_create_submit').click(function(){
    
        const item = {
            title: $('#transparency_create_title').val(),
            description: $('#transparency_create_description').val(),
            value: $('#transparency_create_value').val(),
            dateOfTransaction: common_date_ISOToUnix($('#transparency_create_date').val())
        }

        common_fetch("/api/transparency/item", "POST", item, ["transparency_create_message"])

    });


});