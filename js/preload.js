const { ipcRenderer, contextBridge } = require("electron");

const API = {
    sendMsg: () => ipcRenderer.invoke("make-ssh-tunnel"),
    max: () => ipcRenderer.invoke("maximize"),
    min: () => ipcRenderer.invoke("minimize"),
    close: () => ipcRenderer.send("close"),
};

contextBridge.exposeInMainWorld("api", API);