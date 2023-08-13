const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const socks = require("socksv5");
const { Client } = require("ssh2");
const { exec } = require("child_process");
const regedit = require("regedit");

const localProxy = {
  host: "localhost",
  port: 19000,
};

const sshConfig = {
  host: "51.222.112.51",
  port: 2703,
  username: "amirrezafarzan",
  password: "bt9e7m#zHw7T",
};
class sshTunnel {
  static server;

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
            value: "socks=127.0.0.1:" + localProxy.port + ";",
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

  static ssh() {
    socks
      .createServer((info, accept, deny) => {
        // NOTE: you could just use one ssh2 client connection for all forwards, but
        // you could run into server-imposed limits if you have too many forwards open
        // at any given time
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
                  return deny();
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
            deny();
          })
          .connect(sshConfig);
      })
      .listen(localProxy.port, "localhost")
      .useAuth(socks.auth.None());
  }

  static closeconnection() {
    // Stop the SOCKS5 server
    this.server.close();

    // Close the SSH connection
    this.conn.end();
  }

  static Browsing() {
    const command = `"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --user-data-dir="%USERPROFILE%\\proxy-profile" --proxy-server="socks5://localhost:19000"`;

    exec(command);
  }
}


// ? done of declerfiaction



let win;
let isMaximized = false;
let isWideSystem = 0; // 1 == on , 0 == off
sshTunnel.ssh();

function createWindow() {
  win = new BrowserWindow({
    width: 370,
    height: 700,
    icon: "assets/logo1.png",
    transparent: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: true,
      useContentSize: true,
    },
  });
  win.webContents.openDevTools();
  win.loadFile("index.html");
}

ipcMain.handle("make-ssh-tunnel", async (event, args) => {
  if (args == 1) {
    sshTunnel.widesystem();
    isWideSystem = 1;
  } else if (args == 0) {
    sshTunnel.localsystem();
    isWideSystem = 0;
  }
});

ipcMain.handle("open-browser", () => {
  sshTunnel.Browsing();
});

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
