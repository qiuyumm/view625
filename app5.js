// 存储健康效应数据
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs =require('fs');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const session =require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const createCsvWriter = require('csv-writer').createObjectCsvWriter; 
const csv = require('csv-parser');
const app = express();

//设置跨域访问来源
var corsOptions = {
  origin:" http://localhost:8080"
}
app.use(cors(corsOptions))

require('./moudel/connect.js');

// 设置渲染引擎
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views')); 

app.use(bodyParser.urlencoded({ extended: true }));  
app.use(bodyParser.json());


//设置静态资源目录
app.use(express.static('public'));

app.use(cookieParser());



const coordinateSchema = new mongoose.Schema({
    coordinates: { // 存储整个数组
        type: [[Number]], // 二维数组：每个子数组包含多个数字（经度、纬度、值）
        required: true
    },
});

const Coordinate2 = mongoose.model('jiankang', coordinateSchema);


// 存储数据到 MongoDB
async function storeDataToMongo(dataArray) {
  // 创建新的 Coordinate 文档，将整个数组存储在 coordinates 字段中
  const newCoordinate = new Coordinate2({
      coordinates: dataArray// 将整个二维数组存储

  });

  // 存储到 MongoDB
  await newCoordinate.save();
  // console.log('Data stored successfully:', newCoordinate);
  return newCoordinate;
}
 



// 读取 CSV 文件并存储数据到 MongoDB
function readCsvAndStoreData(filePath) {
  const results = [];

  fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
          // 将 CSV 数据转换为所需的格式
          const dataArray = results.map(row => [
              parseFloat(row.Longitude),
              parseFloat(row.Latitude),
              parseFloat(row.Excess_Deaths)
          ]);

          // 存储数据到 MongoDB
          try {
              const storedData = await storeDataToMongo(dataArray);
              console.log('Data stored successfully:', storedData);
          } catch (error) {
              console.error('Error storing data:', error);
          }
      });
}

// 示例：读取并存储名为 'data.csv' 的文件
readCsvAndStoreData('./public/2025-03-13T19-death2.csv');

  // 监听端口
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`+'点击localhost:4000打开'));