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
 

const app = express();

const { getPm25 } = require('./public/zhandainpm/pm25.js')
const { predict } = require('./public/singlepm/singlepre.js');
const { predictALL } = require('./public/predicte/predict.js')
const { storeDataToMongo } = require('./moudel/storeToMongo.js');
const { Coordinate } = require('./moudel/Coordinate.js');
const { CoordinateJ } = require('./moudel/CoordinateJ.js');
//设置跨域访问来源
var corsOptions = {
  origin:" http://localhost:8080"
}
app.use(cors(corsOptions))

require('./moudel/connect');

// 设置渲染引擎
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views')); 

app.use(bodyParser.urlencoded({ extended: true }));  
app.use(bodyParser.json());

// 每小时调用 Python 脚本并存储数据的函数
async function hourlyTask() {
  try {
      console.log("数据获取中");
      const data = await predictALL(); // 调用 Python 脚本
      console.log("数据存储中")
      await storeDataToMongo(data); // 存储数据到 MongoDB
      console.log("数据获取成功");
  } catch (error) {
      console.error("Error in hourly task:", error);
  }
}

// 启动时立即调用一次
 


// hourlyTask();

// 设置每小时调用一次（1 小时 = 3600000 毫秒）
setInterval(hourlyTask, 3600000); // 每 3600000 毫秒运行一次
//设置静态资源目录
app.use(express.static('public'));

app.use(cookieParser());



  
  app.get('/', (req, res) => {
    res.render('zhanshi');
  });
  

//页面跳转
app.get('/zhanshi', (req, res) => {
  res.render('zhanshi');
});

app.get('/jiankang', (req, res) => {
  res.render('jiankang');
});

app.post('/dian', async (req, res) => {
  // console.log(req.body)
  const { longitude, latitude } = req.body;

  if (!longitude || !latitude) {
    return res.status(400).json({ error: 'Longitude and latitude are required' });
}

try {
    // 调用predict函数
    const result = await predict(longitude, latitude);
    res.json(result);
} catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});

app.post('/api/getData', async (req, res) => {
  try {
    const result = await getPm25();  // 等待 myFunction 返回结果
    // console.log('Result from myFunction:', result);  // 调试日志
    if (result) {
        const { onlydata } =result
        res.status(200).json(onlydata);  // 将 result 对象返回给前端
    } else {
        res.status(500).json({ success: false, message: 'No data returned from script' });
    }
} catch (error) {
    console.error('Error executing script:', error);  // 捕获并记录错误
    res.status(500).json({ success: false, message: 'Error executing script', error: error.message });
}
})
//查询数据库
app.post('/queryData', async (req, res) => {
  const { timestamp } = req.body; // 从请求体中获取时间戳
  console.log(`Fetching data for time: ${timestamp}`);
  try {
      // 查询数据库
      const data = await Coordinate.findOne({ timestamp: new Date(timestamp) });

      if (data) {
        
          return res.status(200).json(data); // 返回找到的数据
      } else {
          // 如果没有找到，返回最新一条数据
          const latestData = await Coordinate.findOne().sort({ timestamp: -1 });
          // console.log(latestData)
          return res.status(200).json(latestData); // 返回最新的数据
      }
  } catch (error) {
      console.error('Error querying data:', error);
      return res.status(500).send('Error querying data');
  }
});
app.post('/queryJkData',async (req, res) => {
  try {
      // 查询数据库
      const latestData = await CoordinateJ.findOne().sort({ _id: -1 });
      // console.log(latestData)
      if (latestData) {
        
          return res.status(200).json(latestData); // 返回找到的数据
      } else {
        return res.status(404).json({ message: 'No data found' });
      }
  } catch (error) {
      console.error('Error querying data:', error);
      return res.status(500).send('Error querying data');
  }
});

  // 监听端口
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`+'点击localhost:4000打开'));