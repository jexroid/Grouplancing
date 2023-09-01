const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const Store = require("electron-store");
const path = require("path");
const socks = require("socksv5");
const { Client } = require("ssh2");
const { exec } = require("child_process");
const { autoUpdater } = require("electron-updater");
const regedit = require("regedit");
regedit.setExternalVBSLocation("resources/regedit/vbs");


const localProxy = {
  host: "localhost",
  port: 25000,
};

// ! HANDLING GLOBAL ERRORS
process.on("uncaughtException", (error) => {
  if (error.code === "ECONNRESET") {
    console.log("ECONNRESET occured");
  } else {
    console.log("error happend. "+error);
  }
});

// ! HANDLING GLOBAL ERRORS

// * SAVING USER SETTING
const store = new Store();
store.delete('sshconfig')

class sshTunnel {
  static ssh() {
    try {
      socks
        .createServer((info, accept, deny) => {
          const conn = new Client();
          conn
            .on("ready", () => {
              conn.forwardOut(
                info.srcAddr,
                info.srcPort,
                info.dstAddr,
                info.dstPort,
                (err, stream) => {
                  if (err) {
                    conn.end();
                    return deny(err);
                  }
                  const clientSocket = accept(true);
                  if (clientSocket) {
                    stream
                      .pipe(clientSocket)
                      .pipe(stream)
                      .on("close", () => {
                        conn.end();
                      });
                  } else {
                    conn.end();
                  }
                }
              );
            })
            .on("error", (err) => {
              deny(err);
            })
            .connect(store.get("sshconfig"));
        })
        .listen(localProxy.port, "localhost")
        .useAuth(socks.auth.None());
    } catch (err) {
      if (err.code == "ECONNRESET") {
        console.log("ECONNRESET error occurred");
      } else if (err.message == "Connection lost before handshake") {
        console.log("Connection lost before handshake error occurred");
        dialog.showErrorBox(
          "Error",
          "اتصال سه مرحله ای تی سی پی با مشکل مواجه شد"
        );
      }
    }
  }

  static async widesystem() {
    const keyPath =
      "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings";

    try {
      await regedit.promisified.putValue({
        [keyPath]: {
          ProxyEnable: {
            value: 1,
            type: "REG_DWORD",
          },
          ProxyServer: {
            value: "socks5://localhost:25000",
            type: "REG_SZ",
          },
          ProxyOverride: {
            value: "localhost;127.0.0.1",
            type: "REG_SZ",
          },
        },
      });
      console.log("Registry values set on successfully");
    } catch (error) {
      console.error("Error setting registry values:", error);
    }
  }

  static async localsystem() {
    const keyPath =
      "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings";

    try {
      await regedit.promisified.putValue({
        [keyPath]: {
          ProxyEnable: {
            value: 0,
            type: "REG_DWORD",
          },
        },
      });
      console.log("Registry values set off successfully");
    } catch (error) {
      console.error("Error setting registry values:", error);
    }
  }

  static Browsing() {
    console.log("running chrome");
    const command = `"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --user-data-dir="%USERPROFILE%\\proxy-profile" --proxy-server="socks5://localhost:25000"`;
    exec(command);
  }
}
// ? done of declerfiaction

let win;
let isMaximized = false;
let isWideSystem = 0; // 1 = on , 0 = off
sshTunnel.ssh();

function createWindow() {
  win = new BrowserWindow({
    width: 370,
    height: 700,
    icon: "assets/logo1.png",
    transparent: true,
    frame: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: true,
      useContentSize: true,
    },
  });

  win.loadFile("index.html");

  win.once('ready-to-show', () => {
  autoUpdater.checkForUpdatesAndNotify();
});
}

// read ECONNRESET
// ! SSH CONFIGURATION
ipcMain.on("make-ssh-tunnel", async (event, args) => {
  if (args == 1) {
    if (store.get("sshconfig") == undefined) {
      console.log("its not set");
      // CODE FOR ERROR OF USER HANDLING, no input have been set from user and sshConfig is not set by Store class
    } else {
      sshTunnel
        .widesystem()
        .then(() => {
          event.returnValue = 0;
        })
        .catch(() => {
          event.returnValue = 1;
          dialog.showErrorBox(
            "Error",
            "تنظیم کردن پروکسی برای کل سیستم با شکست مواجه شد"
          );
        });
      isWideSystem = 1;
    }
  } else if (args == 0) {
    sshTunnel.localsystem();
    isWideSystem = 0;
  }
});

ipcMain.handle("loadcred", (event) => {
  if (store.get("sshconfig") == undefined) {
    console.log("no input has saved");
    return false;
  } else {
    console.log("i got the data");
    return store.get("sshconfig");
  }
});

ipcMain.on("cred", (event, sship, sshport, sshusername, sshpassword) => {
  try {
    store.set({
      sshconfig: {
        host: sship,
        port: sshport,
        username: sshusername,
        password: sshpassword,
      },
    });

    console.log(store.get("sshconfig"));
  } catch (err) {
    console.log("ERROR while setting ip");
    dialog.showErrorBox("Error", "تنظیم کردن مشخصات وی پی اس با خطا مواجه شد");
  }
});

ipcMain.handle("open-browser", () => {
  sshTunnel.Browsing();
});
// ! SSH CONFIGURATION

// ! window integration
ipcMain.handle("minimize", async () => {
  win.minimize();
});

ipcMain.handle("maximize", () => {
  if (isMaximized) {
    win.setSize(370, 700);
    win.center();
    isMaximized = false;
  } else {
    win.maximize();
    isMaximized = true;
  }
});

ipcMain.on("close", () => {
  if (isWideSystem == 1) {
    sshTunnel.localsystem().then(() => {
      app.quit();
    });
  } else {
    app.quit();
  }
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

// * UPDATES SECTION
ipcMain.handle("app_version", (event) => {
  return app.getVersion();
});


autoUpdater.on("update-available", () => {
  win.webContents.send("update_available");
});
autoUpdater.on("update-downloaded", () => {
  win.webContents.send("update_downloaded");
});


ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});

ipcMain.on("open-url", (event, url) => {
  shell.openExternal(url);
});