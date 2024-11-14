const { spawn } = require('child_process');
const path = require('path');

function runPythonScript(lon, lat) {
    return new Promise((resolve, reject) => {
        // const pythonPath = 'python';  // 如果python命令在路径中可以直接使用
        const scriptPath = path.join(__dirname, 'airtime/predict.py'); // 使用绝对路径
        const py = spawn('python', [scriptPath, lon, lat]);

        let data = '';
        let errorData = '';

        py.stdout.on('data', (chunk) => {
            data += chunk.toString();
        });

        py.stderr.on('data', (err) => {
            errorData += err.toString();
        });

        py.on('close', (code) => {
            if (code !== 0) {
                console.error(`Python script exited with code ${code}`);
                if (errorData) {
                    console.error('Python Error Output:', errorData);
                }
                reject(`Python script exited with code ${code}`);
            } else {
                try {
                    resolve(JSON.parse(data));
                } catch (err) {
                    console.error('Error parsing JSON:', err);
                    console.error('Raw Data:', data);
                    reject(err);
                }
            }
        });
    });
}

// // 示例调用
// const lon = 115.99300632517725;
// const lat = 33.855424204284105;

// runPythonScript(lon, lat)
//     .then((result) => {
//         console.log('Predicted PM2.5:', result.PM2_5_Predicted);
//         console.log('Air Data:', result.air);
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });


module.exports = {
    predict: runPythonScript
};