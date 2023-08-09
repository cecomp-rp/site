$('document').ready(function() {

    common_format_dates();
  
});

function common_format_dates(){

    $('.format-date').each(function(){
        
        //If already formated, skip
        if($(this).hasClass('date-formated')){return;}

        var date = parseInt($(this).html());

        var new_date = moment.unix(date/1000).format('DD/MM/YYYY - HH:mm');

        if(new_date != 'Invalid date'){
            $(this).html(new_date);  

            //Add attr class 'date-formated'
            $(this).addClass('date-formated');
        }

    });

    $('.format-date-short').each(function(){

        //If already formated, skip
        if($(this).hasClass('date-formated')){return;}

        var date = parseInt($(this).html());

        var new_date = moment.unix(date/1000).format('DD/MM/YYYY');

        if(new_date != 'Invalid date'){
            $(this).html(new_date);  

            //Add attr class 'date-formated'
            $(this).addClass('date-formated');
        }

    });

}