const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { electron } = require("process");
const { sshTunnel } = require("./js/SshTunnel.js");
const {
  disconnectTOport19,
  connectTOport19,
} = require("./js/widesys.js");

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

// SOCKS5 STATUS
// async function resualt() {
//   testTOport19()
//     .then((result) => {
//       return 0
//     })
//     .catch((error) => {
//       console.error("error ding : ", error);
//     });
// }
// resualt().then((res) => {
//   ipcMain.handle("status-ssh-tunnel", async (event, args) => {
//     console.log("backend says", res)
//     return res;
//   })
// })
// SOCKS5 STATUS

ipcMain.handle("make-ssh-tunnel", async (event, args) => {
  if (args == 1) {
    sshTunnel.ssh();
    // testTOport19()
    //   .then((res) => {
    //     console.error("success ding : ", res);
    //     return res;
    //   })
    //   .catch((error) => {
    //     console.error("error ding : ", error);
    //     return error;
    //   });
    return 0
  } else if (args == 0) {
    sshTunnel.closeconnection();
  }
});

ipcMain.handle("status-ssh-tunnel", async (event) => {
  testTOport19()
    .then((res) => {
      console.error("success ding : ", res);
      return res;
    })
    .catch((error) => {
      console.error("error ding : ", error);
      return error;
    });
});

ipcMain.handle("open-browser", () => {
  sshTunnel.Browsing();
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
