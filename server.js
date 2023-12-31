"use strict"
require('dotenv').config();
const swaggerUI = require("swagger-ui-express");
const low = require("lowdb");
const {join} = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require("path");
const FileSync = require("lowdb/adapters/FileSync");
const morgan = require("morgan");

const adapter = new FileSync(join(__dirname,'..','db.json'));
const db = low(adapter);
db.defaults({ todos:[],users:[] }).write();    

const app = express();

// const multer = require('multer');
// const sharp = require('sharp');  // npm package for image resize and process

app.use(cors());
app.use(bodyParser.json({limit:"50mb"}));
app.use(bodyParser.urlencoded({ extended: true , limit:"50mb"}));
app.use(morgan("dev"));
app.use(express.static(__dirname + '/public'));

app.use('/images', express.static(path.normalize(path.join( __dirname, '/images/products'))));  // required to send file
// console.log(path.join( __dirname, '/images/products'));
// console.log(__filename);
const port = process.env.APP_PORT || 4000;

// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled')
//     } else {
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down. Check back soon!')
// })


// const upload = multer({
//     // dest: 'images',   if not commented file would not be passed to route handler/location function
//     limits : {
//         fileSize : 1000
//     },

//     fileFilter (req, file, cb) {
//         // cb(null, false)
//         // cb(null, true)
//         if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//             cb(new Error('Please upload jpg/jpeg/png file.'));
//         }
//         console.log(file.originalname);
//         cb(undefined, true);
//       }
// });

// app.use('/img/uploads', upload.single('productImg'), async (req, res, next)=> {
//     let buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
//     //save buffer img to db
//     console.log(buffer);
//     res.send({msg: 'file uploaded.'})
// }, (err, req, res, next)=> {
//     res.status(400).send({ error: err.message }); //if err send cb err msg from fileFilter
// })



const userRouter = require('./routes/userRoutes');
app.use('/api', userRouter)

const supplierRouter = require('./routes/supplierRoutes');
app.use('/api', supplierRouter)

const productRouter = require('./routes/productRoutes');
app.use('/api', productRouter)

const syncHotelRouter = require('./routes/integrationRoutes');
app.use('/api/integration', syncHotelRouter)

const masterDataRouter = require('./routes/masterDataRoutes');
app.use('/api/master', masterDataRouter)

const masterHotelRouter = require('./routes/masterHotelRoutes');
app.use('/api/hotel', masterHotelRouter)

const documentationRouter = require('./docs');
app.use('/api/doc', swaggerUI.serve,swaggerUI.setup(documentationRouter))

app.listen(port, ()=> {
    console.log('Server is running on port ', port);
})