const mongoose = require("mongoose");
const { stream } = require("xlsx");

//创建文档存储数据库规范
const fileSchema = new mongoose.Schema({
    name: String,
    data: Buffer,
    
    auther:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User'
    },
  });
  
  // 创建文档集合
  const File = mongoose.model("File", fileSchema);
  

  module.exports={
    File:File
  }