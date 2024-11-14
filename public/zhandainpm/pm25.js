// const ExcelJS = require('exceljs');
const { spawn } = require('child_process');
const fs = require('fs');
//const path = require('path');


var count = 0;

function runPythonScript(scriptPath) {
    return new Promise((resolve, reject) => {
        let scriptOutput = '';
        const pythonProcess = spawn('python', [scriptPath]);

        pythonProcess.stdout.on('data', (data) => {
            scriptOutput += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`脚本错误： ${data}`);
            reject(data.toString());
        });

        pythonProcess.on('close', (code) => {
            console.log(`数据获取成功，状态码 ${code}`);
            resolve(scriptOutput);
        });
    });
}



// 定义一个要定时执行的函数
async function getPm25() {
    try{
        const output = await runPythonScript('./public/zhandainpm/pyAQI/ipe2.py');
        const obj = (eval('(' + unescape(output) + ')'));

            //   console.log(obj) 
            const data = obj.data
            const onlydata = [...new Set(data.map(JSON.stringify))].map(JSON.parse)
            // console.log(onlydata)
            const time = obj.Time
            const length = data.length
            const onlylength =onlydata.length
            console.log(length,onlylength)
            const timelength = time + '_' + onlylength + '.csv'
            const timelength2 = timelength.replace(/:/g, "-")
            const filename = timelength2.replace(/\s/g, "_")

            // 添加 CSV 表头
            const csvHeader = 'id,latitude,longitude,rank,data\n';

            // 将数据转换为 CSV 格式
            const csvContent = onlydata.map(row => row.join(',')).join('\n');

            // 合并表头和数据内容
            const csvData = csvHeader + csvContent;

            // 将数据写入 CSV 文件
            fs.writeFileSync(filename, csvData, 'utf-8')
            // console.log(onlydata)
            return {
                onlydata
            }
     }catch (error) {
        console.error('Error:', error);
        throw error;
    }
    //console.log('数据获取成功');

    // runPythonScript('./public/zhandainpm/pyAQI/ipe2.py')
    //     .then((output) => {
    //         //console.log('Python脚本输出:', output);
    //         // console.log('Python script output:', output);  // 检查 Python 脚本的原始输出

    //         const obj = (eval('(' + unescape(output) + ')'));

    //         //   console.log(obj) 
    //         const data = obj.data
    //         const onlydata = [...new Set(data.map(JSON.stringify))].map(JSON.parse)
    //         // console.log(onlydata)
    //         const time = obj.Time
    //         const length = data.length
    //         const onlylength =onlydata.length
    //         console.log(length,onlylength)
    //         const timelength = time + '_' + onlylength + '.csv'
    //         const timelength2 = timelength.replace(/:/g, "-")
    //         const filename = timelength2.replace(/\s/g, "_")

    //         // 添加 CSV 表头
    //         const csvHeader = 'id,latitude,longitude,rank,data\n';

    //         // 将数据转换为 CSV 格式
    //         const csvContent = onlydata.map(row => row.join(',')).join('\n');

    //         // 合并表头和数据内容
    //         const csvData = csvHeader + csvContent;

    //         // 将数据写入 CSV 文件
    //         fs.writeFileSync(filename, csvData, 'utf-8')
    //         // console.log(onlydata)
    //         return {
    //             onlydata
    //         }
    //     })
    //     .catch((error) => {
    //         console.error('执行脚本时发生错误：', error);
    //     });
    // count++;
    // console.log('这个函数已经执行了 ' + count + ' 次');
    

}

// 设置定时器，每隔1000毫秒（1秒）执行一次myFunction函数
// setInterval(myFunction, 20 * 60 * 1000);
// getPm25()
// setInterval(myFunction, 10 * 1000);

module.exports ={
    getPm25
}