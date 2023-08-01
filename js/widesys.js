const spawn = require("child_process").spawn;


function connectTOport19() {
    const python = spawn('python', ["./proxy.py", '19000']);
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
    const python = spawn('python', ["./proxy.py", 'dis']);
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





// testTOport19()
//     .then((result) => {
//         console.log(result);
//     })
//     .catch((error) => {
//         console.error(error);
//     });
