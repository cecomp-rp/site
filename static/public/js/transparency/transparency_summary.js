$(document).ready(function(){

    common_fetch("/api/transparency/summary", "GET" ).then((data) => {

        if(data){
            $("#transparency_summary_total_cash").text(data.total)
        }
    
    });

});
