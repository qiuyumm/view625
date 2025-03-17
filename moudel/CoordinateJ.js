const mongoose = require("mongoose");

const coordinateSchema = new mongoose.Schema({
    coordinates: { // 存储整个数组
        type: [[Number]], // 二维数组：每个子数组包含多个数字（经度、纬度、值）
        required: true
    },
});

const CoordinateJ = mongoose.model('jiankang', coordinateSchema);

module.exports = { CoordinateJ };

