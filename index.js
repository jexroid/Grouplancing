const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { electron } = require('process');
const { sshTunnel } = require('./js/SshTunnel.js');


let win;

function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 800,
    transparent: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'js/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      useContentSize: true,
    },
  });
  win.webContents.openDevTools()
  win.loadFile('app/index.html')
}


// SOCKS5 STATUS
async function resualt() {
  let status = await sshTunnel.testConnection();
  return status
}
// SOCKS5 STATUS


ipcMain.handle("make-ssh-tunnel", async (event, args) => {
  if (args == 1) {
    console.log("user asked for activating tunnel: ", args)
    sshTunnel.ssh()

    resualt().then((res) => {
      ipcMain.handle("status-ssh-tunnel", async (event, args) => {
        console.log("backend says",res)
        return res;
      })
    })
  }
})

ipcMain.handle("status-ssh-tunnel", async (event, args) => {
  let status = await resualt();
  console.log("backend says", status);
  return status;
});

ipcMain.handle("minimize", async () => {
  win.minimize();
});


ipcMain.handle("maximize", async () => {
  if (win.isMaximized()) {
    win.restore();
  } else {
    win.maximize();
  }
});

ipcMain.on("close", () => {
  app.quit();
});

app.whenReady().then(async () => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});