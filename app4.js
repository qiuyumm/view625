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

const app = express();

const { getPm25 } = require('./public/zhandainpm/pm25.js')
const { predict } = require('./public/singlepm/singlepre.js');
const { predictALL } = require('./public/predicte/predict.js')
const { storeDataToMongo } = require('./moudel/storeToMongo.js');
const { Coordinate } = require('./moudel/Coordinate.js');
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



 async function exportCoordinatesToCSV() {
   try {
     // 查询数据
     const timestamp = '2025-03-15T11:00:00.000Z';
     const data = await Coordinate.findOne({ timestamp: new Date(timestamp) });
 
     if (!data || !data.coordinates || data.coordinates.length === 0) {
       console.log('未找到数据或 coordinates 为空');
       return;
     }
 
     console.log('数据查询成功，正在导出到 CSV 文件...');
 
     // 设置 CSV 文件路径和表头
     const csvWriter = createCsvWriter({
       path: './2025-03-15T11.csv',
       header: [
         { id: 'longitude', title: 'longitude' },
         { id: 'latitude', title: 'latitude' },
         { id: 'PM2.5', title: 'PM2.5' }
       ]
     });
 
     // 格式化数据
     const records = data.coordinates.map(item => ({
       longitude: item[0],
       latitude: item[1],
       'PM2.5': item[2]
     }));
 
     // 写入到 CSV 文件
     await csvWriter.writeRecords(records);
     console.log('CSV 文件导出成功！');
   } catch (error) {
     console.error('导出数据时出错:', error);
   } finally {
     mongoose.connection.close(); // 关闭数据库连接
   }
 }
 
 // 调用导出函数
 exportCoordinatesToCSV(); 
 



  // 监听端口
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`+'点击localhost:4000打开'));