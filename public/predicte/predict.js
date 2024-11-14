const { spawn } = require('child_process');
const path = require('path');

function predictALL() {
    return new Promise((resolve, reject) => {
        // const pythonPath = 'python';  // 如果python命令在路径中可以直接使用
        const scriptPath = path.join(__dirname, 'henanairpredict/airToidwToLight.py'); // 使用绝对路径
        const pythonProcess  = spawn('python', [scriptPath]);

        let scriptOutput = '';
        let errorOutput = '';
        // 捕获 Python 脚本的标准输出
        pythonProcess.stdout.on('data', (data) => {
            scriptOutput += data.toString();
        });
        pythonProcess.stderr.on('data', (data) => {
            errorOutput += data.toString(); // 累积错误信息
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                // 捕获退出代码不为0的错误，并包含 stderr 的输出
                return reject(new Error(`Python script exited with code ${code}. Error: ${errorOutput}`));
            }
            try {
                // 尝试解析 Python 的标准输出
                const parsedOutput = JSON.parse(scriptOutput);
                resolve(parsedOutput);
            } catch (err) {
                // 如果解析失败，也返回 stderr 信息，帮助调试
                reject(new Error(`Failed to parse JSON. Error: ${err.message}. Python stderr: ${errorOutput}`));
            }
        });
    });

    
}

module.exports = {
    predictALL: predictALL
};