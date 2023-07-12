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
            //Add activity.duration to totalHours
            totalHours += activity.duration;
        })

        //Test expression ~total_hours
        const regex3 = /~total_hours/gi;
        body = body.replace(regex3, totalHours);
    }

    if(data.activities){
        
        var append = "";

        //For each activity in activities
        data.activities.forEach((activity) => {
            //Replace ~activities with activity.title, startDate, duration, description
            
            append = append + 
            `
                <div>
                    <h3>${activity.title}</h3>
                    <p>${activity.description}</p>
                    <p>${activity.startDate}</p>
                    <p>${activity.duration}</p>
                </div>
                <br>
            `;

        })

        //Test expression ~activities
        const regex7 = /~activities/gi;
        body = body.replace(regex7, append);

    }


    return body;
}

module.exports = addFields;