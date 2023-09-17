function addFields(body, data){

    
    /*
    CERTIFICADO (not event)
    user

    CERTIFICADO (event)
    user
    event
    activities (user did)

    EVENTO
    event

    EMAIL (not event)
    user

    EMAIL (event)
    user
    event
    */

    //GENERAL (user)
    if(data.user && data.user.email){
        //Test expression ~email
        const regex = /~email/gi;
        body = body.replace(regex, data.user.email);
    }
    
    if(data.user && data.user.name){
        //Test expression ~name
        const regex2 = /~name/gi;
        body = body.replace(regex2, data.user.name);
    }

    //EVENT (event)
    if(data.event && data.event.name){
        //Test expression ~event_name
        const regex4 = /~event_name/gi;
        body = body.replace(regex4, data.event.name);
    }

    if(data.event && data.event.title){
        //Test expression ~event_title
        const regex5 = /~event_title/gi;
        body = body.replace(regex5, data.event.title);
    }

    if(data.event && data.event.description){
        //Test expression ~event_description
        const regex6 = /~event_description/gi;
        body = body.replace(regex6, data.event.description);
    }

    if(data.event && data.event.startDate){
        //Test expression ~event_start_date
        const regex5 = /~event_start_date/gi;
        body = body.replace(regex5, data.event.startDate);
    }

    if(data.event && data.event.endDate){
        //Test expression ~event_end_date
        const regex6 = /~event_end_date/gi;
        body = body.replace(regex6, data.event.endDate);
    }


    //ACTIVITIES (activities)
    if(data.activities){
        var totalHours = 0;

        //For each activity in activities
        data.activities.forEach((activity) => {

            if(activity) {

                if(!activity.duration) {
                    activity.duration = 0;
                }

                //Add activity.duration to totalHours
                totalHours += activity.duration;

            }
           
        })

        //Test expression ~total_hours
        const regex3 = /~total_hours/gi;
        body = body.replace(regex3, totalHours);
    }

    if(data.activities){
        
        var append = "<div class='flex col'>";

        //For each activity in activities
        data.activities.forEach((activity) => {
            //Replace ~activities with activity.title, startDate, duration, description
            
            if(activity) {

                append = append + 
                `
                    <div class="box-3 no-bg border-1 flex col" style="margin:0; margin-top:20px;">
                        <h3 class="text-3" style="margin:0; padding:0; margin-bottom: 15px;">${activity.title}</h3>
                        <p style="margin-bottom: 15px;">${activity.description}</p>
                        <p>Realizada em: <label class="format-date">${activity.startDate}</label></p>
                        <p>Duração: ${activity.duration} horas</p>
                    </div>
                `;

            }

        })

        append = append + "</div>";

        //Test expression ~activities
        const regex7 = /~activities/gi;
        body = body.replace(regex7, append);

    }


    return body;
}

module.exports = addFields;