// storeToMongo.js
const path = require('path');
//const scriptPath = path.join(__dirname, 'airdata.js'); // 使用绝对路径


const mongoose = require('mongoose');
const { Coordinate } = require('./Coordinate.js'); // Mongoose 模型

// 获取当前整点时间
function getCurrentHour() {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    const localISOTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString();

    // console.log(localISOTime)
    return localISOTime;
}

// 存储数据到 MongoDB
async function storeDataToMongo(dataArray) {
    const currentTimestamp = getCurrentHour(); // 获取整点时间

    // 创建新的 Coordinate 文档，将整个数组存储在 coordinates 字段中
    const newCoordinate = new Coordinate({
        coordinates: dataArray, // 将整个二维数组存储
        timestamp: currentTimestamp
    });

    // 存储到 MongoDB
    await newCoordinate.save();
    // console.log('Data stored successfully:', newCoordinate);
    return newCoordinate;
}

module.exports = { storeDataToMongo };
