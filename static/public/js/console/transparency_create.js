$(document).ready(function(){

    $('#transparency_create_submit').click(function(){
    
        const item = {
            title: $('#transparency_create_title').val(),
            description: $('#transparency_create_description').val(),
            value: $('#transparency_create_value').val(),
            dateOfTransaction: $('#transparency_create_date').val()
        }

        fetch("/api/transparency/item", {
            method: "POST",
            cache: "default", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(item), 

        }).then((response) => {

            if(response.status == 201) {
                $('#transparency_create_message').text("Success!")
            } else {
                $('#transparency_create_message').text("Item creation failed!")
            }

        }).catch((err) => {
            console.log(err)
        })
     

    });


});