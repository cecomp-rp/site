$(document).ready(function(){

    fetch("/api/transparency/summary", {
        method: "GET",
        cache: "default", 
        headers: {
            "Content-Type": "application/json",
        }

    }).then((response) => {response.json().then((data) => {
           
        $("#transparency_summary_total_cash").text(data.total)


    })}).catch((err) => {
        console.log(err)
    })
     

});
