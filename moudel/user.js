//用户集合
const mongoose = require("mongoose");

//用户集合规范
const db = mongoose.connection;
  
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log('Connected to MongoDB');
  });
  
  const userSchema = new mongoose.Schema({
    name:{type:String,
          required: true 
         },
    tel:{type: String,
      required: true         
      },
    password: {type: String,
              required: true         
              },
    role:String

  });
  
  const User = mongoose.model('User', userSchema);
//创建管理员文档规范
const manSchema = new mongoose.Schema({
  name:{type:String,
        required: true 
       },
  password: {type: String,
            required: true         
            }
});

// 创建文档集合
const Manager = mongoose.model("manager", manSchema);

  Manager.create({name:'admin',password:'123456'});

  module.exports={
    User:User,
    Manager:Manager
  }