$(document).ready(function(){
    common_createRetract();
});

function common_createRetract(){

    $('.create-retract').each(function(){
        
        //Check if the div already has a retract button
        if($(this).hasClass('retract-created')){return;}

        //Create a unique ID for the div
        var divId = 'retract-' + Math.floor(Math.random() * 1000000000);
        $(this).attr('id', divId);

        //Get divs parent
        var parent = $(this).parent();

        //Append retract button
        parent.append(`
        <div class="flex center">
        <button id="${divId + '-button'}" class="retract-button button-2" onclick="common_retract_expand('${divId}')">...</button>
        </div>
        `);

        //Hide
        common_retract_retract(divId);

        //Add class 'retract-created'
        $(this).addClass('retract-created');

    });

}

function common_retract_expand(divId){

    //Show
    //Animate with blur, only horizontal, remove blur on complete
    $('#'+divId).animate(
        {height: 'toggle', 
        opacity: 'toggle'},
        400,
        function(){

            //Remove blur with transition
            $('#'+divId).css('filter', 'blur(0px)');
            
            
            
        }
    );
        
    //Change button
    $('#'+divId+'-button').text('▲');
    $('#'+divId+'-button').attr('onclick', 'common_retract_retract(\''+divId+'\')');

}

function common_retract_retract(divId){
    
    //Hide
    //Animate with blur
    $('#'+divId).css('filter', 'blur(10px)');
    $('#'+divId).animate({height: 'toggle', opacity: 'toggle'}, 400);

    //Change button
    $('#'+divId+'-button').text('. . .');
    $('#'+divId+'-button').attr('onclick', 'common_retract_expand(\''+divId+'\')');
    
}