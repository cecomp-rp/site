$(document).ready(function () {
    common_granim_find();
});

function common_granim_find(){
    $('.granim').each(function (index, element) {

        //If already formated, skip
        if($(this).hasClass('granim-formated')){return;}

        //Add attr class 'granim-formated'
        $(this).addClass('granim-formated');

        common_granim_preset(element)
    });
}

function common_granim_create(div, config){
    var granim;

    const uniq = 'id' + (new Date()).getTime() + parseInt(Math.random() * 1000);
    const basic_config = {
            element: '#' + uniq,
            loop: true,
            isPausedWhenNotInView: false
        };

    config = Object.assign(config, basic_config);


    $(div).append(`
        <canvas id=${uniq} class="granim-canvas"></canvas>
    `)

    .ready(function(){
        var granim = new Granim(config);
        common_granim_update(div, '#' + uniq, granim);
    })

}

function common_granim_preset(div){
    var config;

    const preset_string = $(div).attr('granim')
    var preset = parseInt(preset_string)

    if(isNaN(preset)){
        preset = 0;
    }

    switch(preset){

        case 1:
            config = {
                direction: 'diagonal',
                states : {
                    "default-state": {
                        gradients: [
                            ['#1d1d1d', '#492a7a'],
                            ['#492a7a', '#2f3333'],
                            ['#2f3333', '#1d1d1d']
                        ],
                        transitionSpeed: 5000
                    }
                }
            }
            break;

        case 2:
            config = {
                direction: 'diagonal',
                states : {
                    "default-state": {
                        gradients: [
                            ['#492a7a', '#8840b8'],
                            ['#8840b8', '#FFF333'],
                            ['#FFF333', '#492a7a']
                        ],
                        transitionSpeed: 5000
                    }
                }
            }
            break;
        
        case 3:
            config = {
                direction: 'diagonal',
                states : {
                    "default-state": {
                        gradients: [
                            ['#8840b8', '#8840b8'],
                            ['#8840b8', '#ffffff'],
                            ['#ffffff', '#8840b8']
                        ],
                        transitionSpeed: 5000
                    }
                }
            }
            break;

        case 4:
            config = {
                direction: 'diagonal',
                states : {
                    "default-state": {
                        gradients: [
                            ['#8840b8', '#85E5E5'],
                            ['#8840b8', '#8840b8'],
                            ['#85E5E5', '#8840b8']
                            
                        ],
                        transitionSpeed: 5000
                    }
                }
            }
            break;

        default: 
            config = {
                direction: 'diagonal',
                states : {
                    "default-state": {
                        gradients: [
                            ['#8840b8', '#492a7a'],
                            ['#492a7a', '#1d1d1d'],
                            ['#1d1d1d', '#8840b8']
                        ],
                        transitionSpeed: 5000
                    }
                }
            }
            break;
        
    }

    common_granim_create(div, config);

}

function common_granim_update(div, canvas, granim){
    var dataUrl;

    //Animation params
    const frame_rate = 30;
    var anim_type = $(div).attr('granim-type')

    if(!anim_type){
        anim_type = 'not_hover';
    }

    //Animation
    common_granim_update_aux(div, canvas, granim)
    setInterval(function () {

        if(anim_type == 'hover'){
            
            //Hover?
            if(!$(div).is(':hover')){
                granim.pause();
                return;
            }

            //Resume
            granim.play();

        }
        
        //Update
        common_granim_update_aux(div, canvas, granim)

    }, 1000 / frame_rate);

}

function common_granim_update_aux(div, canvas, granim){
    
    //Filters
    //canvas.filter = 'blur(100px)';

    dataUrl = $(canvas)[0].toDataURL();

    $(div).css({
        'background': 'url(' + dataUrl + ')',
        'background-position': 'center center',
        'background-size': 'cover',
        'background-repeat': 'no-repeat'
    });

    //Clear URL data
    dataUrl = null;


}

