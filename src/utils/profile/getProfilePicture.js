var request             = require('axios')

const getProfilePic = async(link) => {

    if(link){
        const image = await request.get(link, {responseType: 'arraybuffer'});
        var dataPic = "data:image/png;base64, " + Buffer.from(image.data).toString('base64');
        return dataPic
    }else{
        dataPic = "/img/default-profile-picture.png"
    }

}

module.exports = getProfilePic