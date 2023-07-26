const { ipcRenderer, contextBridge } = require("electron");


const API = {

    sendMsg: () => ipcRenderer.send("make-ssh-tunnel"),

    max: () => ipcRenderer.send("maximize"),

    min: () => ipcRenderer.send("minimize"),

    close: () => ipcRenderer.send("close")

}

contextBridge.exposeInMainWorld("api", API);