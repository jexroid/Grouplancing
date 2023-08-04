const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { electron } = require("process");
const { sshTunnel } = require("./js/SshTunnel.js");
const { disconnectTOport19, connectTOport19 } = require("./js/widesys.js");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 800,
    icon: "assets/img/logo.ico",
    transparent: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "js/preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      useContentSize: true,
    },
  });
  win.webContents.openDevTools();
  win.loadFile("app/index.html");
}

ipcMain.handle("close-ssh-tunnel", async (event, args) => {
  sshTunnel.closeconnection();
});

ipcMain.on("wide-system-proxy", (event, args) => {
  if (args === 0) {
    connectTOport19()
      .then((event.returnValue = 0))
      .catch((err) => {
        event.returnValue = 1;
        console.log("Error windows registry :");
      });
  }
});

ipcMain.handle("make-ssh-tunnel", async (event, args) => {
  if (args == 1) {
    console.log("renderer want connection");
    sshTunnel.ssh();
    return "fine";
  } else if (args == 0) {
    sshTunnel.closeconnection();
    return "close";
  }
});

ipcMain.handle("open-browser", () => {
  sshTunnel.Browsing();
});

// ! window integration
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

// ! Closing app
app.whenReady().then(async () => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
