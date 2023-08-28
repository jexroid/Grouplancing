const { ipcRenderer, contextBridge } = require("electron");



const API = {

    max: () => ipcRenderer.invoke("maximize"),
    min: () => ipcRenderer.invoke("minimize"),
    close: () => ipcRenderer.send("close")
};

contextBridge.exposeInMainWorld("WindowInteractApi", API);




const connection = {
    makeSshTunnel: async (status) => await ipcRenderer.send("make-ssh-tunnel", status),
    WideSystemProxy: (button) => ipcRenderer.sendSync("wide-system-proxy", button),
    openBrowser: async () => ipcRenderer.invoke("open-browser"),
    credentials: (ip, port, user, pass) => ipcRenderer.send("cred", ip, port, user, pass),
    LoadCredentials: async (msg) => ipcRenderer.invoke("loadcred", msg)
}

contextBridge.exposeInMainWorld("api", connection);


// function invokeTunnel() {
//     ipcRenderer.on('activate-reply', (_event, arg) => {
//         contextBridge.exposeInMainWorld("changeHTML", content);
//     })
//     ipcRenderer.send('activate-message', 'active')
// }