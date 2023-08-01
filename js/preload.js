const { ipcRenderer, contextBridge } = require("electron");



const API = {

    max: () => ipcRenderer.invoke("maximize"),
    min: () => ipcRenderer.invoke("minimize"),
    close: () => ipcRenderer.send("close")
};

contextBridge.exposeInMainWorld("WindowInteractApi", API);



const connection = {
    makeSshTunnel: async (status) => await ipcRenderer.invoke("make-ssh-tunnel", status),
    openBrowser: () => ipcRenderer.invoke("open-browser")
}

contextBridge.exposeInMainWorld("api", connection);


// function invokeTunnel() {
//     ipcRenderer.on('activate-reply', (_event, arg) => {
//         contextBridge.exposeInMainWorld("changeHTML", content);
//     })
//     ipcRenderer.send('activate-message', 'active')
// }