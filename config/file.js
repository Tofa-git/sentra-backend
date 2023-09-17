const axios = require('axios');
const fs = require('fs');
const path = require('path');
const db = require('../config/sequelize');
const { responseSuccess, responseError } = require('../utils/response');
const fileModel = db.file;
const hotelFile = db.hotelPhoto;
const roomFile = db.roomPhoto;

// Function to download and save an image
const downloadAndSaveImageHotel = async (urlImage, filename,userId,hotelId) => {
    try {
        const response = await axios.get(urlImage, { responseType: 'arraybuffer' });
        const imagePath = filename; // Adjust the path as needed    

        let creates = [];

        // to declare some path to store your converted image
        const url = '/images/hotel/' + imagePath

        // Get the directory path
        const directory = path.dirname('./public' + url);

        // Create the directory if it doesn't exist
        if (!fs.existsSync(directory)) {                
            fs.mkdirSync(directory, { recursive: true });
        }        

        fs.writeFileSync('./public' + url, response.data);       
        
        const hotelData = {                                        
            hotelId: hotelId,
            url: filename,            
            type:"Photo",
            isMain:false,
            status: '1',
            createdBy: userId,
        };
        await hotelFile.create(hotelData);

    } catch (error) {
        console.error(`Error downloading image ${filename}:`, error);
    }
};

const downloadAndSaveImageRoom = async (urlImage, filename,userId,hotelId,roomId,main) => {
    try {
        const response = await axios.get(urlImage, { responseType: 'arraybuffer' });
        const imagePath = filename; // Adjust the path as needed    

        let creates = [];

        // to declare some path to store your converted image
        const url = '/images/room/' + imagePath

        // Get the directory path
        const directory = path.dirname('./public' + url);

        // Create the directory if it doesn't exist
        if (!fs.existsSync(directory)) {                
            fs.mkdirSync(directory, { recursive: true });
        }        

        fs.writeFileSync('./public' + url, response.data);       
        
        const hotelData = {                                        
            hotelId: hotelId,
            roomId: roomId,
            url: filename,        
            type:"Photo",
            isMain:main,
            status: '1',
            createdBy: userId,
        };
        await roomFile.create(hotelData);
    
    } catch (error) {
        console.error(`Error downloading image ${filename}:`, error);
    }
};

module.exports = {
    downloadAndSaveImageHotel,
    downloadAndSaveImageRoom
}
