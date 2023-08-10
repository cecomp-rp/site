//Evaluate Screen Proportion and set classes
var block = 0
var state = 3

function defineProportion(){

    var maxProportion = 1;

    block = 1

    var height = window.innerHeight;
    var width = window.innerWidth;
    var proportion = height/width;

    if(proportion<maxProportion){
        $(".mobile").hide()
        $(".mobile").attr("visibility", "hidden")

        $(".desktop").show()
        $(".desktop").attr("visibility", "visible")
    }else{
        $(".mobile").show()
        $(".mobile").attr("visibility", "visible")

        $(".desktop").hide()
        $(".desktop").attr("visibility", "hidden")
    }

    block = 0
}
    
$(window).resize( function (){
    if(block == 0){defineProportion()};
    setTimeout(function() {/*Boo*/}, 150)
});

$(document).ready(function(){
    defineProportion();
})














