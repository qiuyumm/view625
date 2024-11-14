//链接数据库

const mongoose = require("mongoose");

// 连接 MongoDB
mongoose.connect("mongodb://127.0.0.1/geoPM", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));