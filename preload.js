const { ipcRenderer, contextBridge } = require("electron");



const API = {

    max: () => ipcRenderer.invoke("maximize"),
    min: () => ipcRenderer.invoke("minimize"),
    close: () => ipcRenderer.send("close"),
    // * UPDATES
    ver: async (version) => ipcRenderer.invoke("app_version", version),
    restart: () => ipcRenderer.send("restart_app"),
    openURLInBrowser: (url) => ipcRenderer.send('open-url', url)
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





// UPDATE
const notification = document.getElementById("notification");
const message = document.getElementById("message");
const restartButton = document.getElementById("restart-button");
ipcRenderer.on("update_available", () => {
  ipcRenderer.removeAllListeners("update_available");
  message.innerText = "A new update is available. Downloading now...";
  notification.classList.remove("hidden");
});
ipcRenderer.on("update_downloaded", () => {
  ipcRenderer.removeAllListeners("update_downloaded");
  message.innerText =
    "Update Downloaded. It will be installed on restart. Restart now?";
  restartButton.classList.remove("hidden");
  notification.classList.remove("hidden");
});


