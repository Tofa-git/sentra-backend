const axios = require('axios');
const fs = require('fs');
const path = require('path');
const db = require('../config/sequelize');
const { responseSuccess, responseError } = require('../utils/response');
const fileModel = db.file;
const hotelFile = db.hotelPhoto;

// Function to download and save an image
const downloadAndSaveImageHotel = async (urlImage, filename,userId,hotelId) => {
    try {
        const response = await axios.get(urlImage, { responseType: 'arraybuffer' });
        const imagePath = path.join(__dirname, 'images', filename); // Adjust the path as needed    

        let creates = [];

        // to declare some path to store your converted image
        const url = '/images/hotel/' + Date.now() + '.png'

        // Get the directory path
        const directory = path.dirname('./public' + url);

        // Create the directory if it doesn't exist
        if (!fs.existsSync(directory)) {                
            fs.mkdirSync(directory, { recursive: true });
        }        

        fs.writeFileSync('./public' + url, filename, { encoding: 'base64' });       
        
        const hotelData = {                                        
            hotelId: hotelId,
            url: cityData.id,
            type:"Hotel",
            status: '1',
            createdBy: userId,
        };
        await hotelFile.create(hotelData);

    } catch (error) {
        console.error(`Error downloading image ${filename}:`, error);
    }
};

const downloadAndSaveImageRoom = async (urlImage, filename,userId,hotelId) => {
    try {
        const response = await axios.get(urlImage, { responseType: 'arraybuffer' });
        const imagePath = path.join(__dirname, 'images', filename); // Adjust the path as needed    

        let creates = [];

        // to declare some path to store your converted image
        const url = '/images/room/' + Date.now() + '.png'

        // Get the directory path
        const directory = path.dirname('./public' + url);

        // Create the directory if it doesn't exist
        if (!fs.existsSync(directory)) {                
            fs.mkdirSync(directory, { recursive: true });
        }                

        fs.writeFileSync('./public' + url, filename, { encoding: 'base64' });  
        
        const hotelData = {                                        
            hotelId: hotelId,
            url: url,
            type:"Room",
            status: '1',
            createdBy: userId,
        };
        await hotelFile.create(hotelData);
    
    } catch (error) {
        console.error(`Error downloading image ${filename}:`, error);
    }
};

module.exports = {
    downloadAndSaveImageHotel,
    downloadAndSaveImageRoom
}
