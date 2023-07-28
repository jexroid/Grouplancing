const { ipcRenderer, contextBridge } = require("electron");



const API = {

    max: () => ipcRenderer.invoke("maximize"),
    min: () => ipcRenderer.invoke("minimize"),
    close: () => ipcRenderer.send("close")
};

contextBridge.exposeInMainWorld("WindowInteractApi", API);



const connection = {
    makeSshTunnel: async (status) => await ipcRenderer.invoke("make-ssh-tunnel", status),

    statusSshTunnel: (stat) => ipcRenderer.invoke("status-ssh-tunnel" , stat)
    // closeSshTunnel: () => ipcRenderer.invoke("close-ssh-tunnel")
}

contextBridge.exposeInMainWorld("api", connection);


// function invokeTunnel() {
//     ipcRenderer.on('activate-reply', (_event, arg) => {
//         contextBridge.exposeInMainWorld("changeHTML", content);
//     })
//     ipcRenderer.send('activate-message', 'active')
// }