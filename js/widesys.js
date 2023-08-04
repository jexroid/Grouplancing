const spawn = require("child_process").spawn;


function connectTOport19() {
    let python = spawn('python', [__dirname+"\\proxy.py", '19000']);
    return new Promise((resolve, reject) => {
        python.on('close', (code) => {
            if (code !== 0) {
                reject(1)
            } else {
                resolve(0)
            }
        });
    })
    
}

function disconnectTOport19() {
    let python = spawn('python', [__dirname+"\\proxy.py", 'dis']);
    return new Promise((resolve, reject) => {
        python.on('close', (code) => {
            if (code !== 0) {
                reject(1)
            } else {
                resolve(0)
            }
        });
    })
    
}





module.exports = { disconnectTOport19, connectTOport19 }