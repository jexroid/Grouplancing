const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { electron } = require('process');
const socks = require('socksv5');
const { Client } = require('ssh2');

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
  // win.webContents.openDevTools()
  win.loadFile('app/index.html')
}

const sshConfig = {
  host: '51.222.112.51',
  port: 2703,
  username: 'amirrezafarzan',
  password: 'bt9e7m#zHw7T'
};

function ssh() {
  socks.createServer((info, accept, deny) => {
    // NOTE: you could just use one ssh2 client connection for all forwards, but
    // you could run into server-imposed limits if you have too many forwards open
    // at any given time
    const conn = new Client();
    conn.on('ready', () => {
      conn.forwardOut(info.srcAddr,
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
            stream.pipe(clientSocket).pipe(stream).on('close', () => {
              conn.end();
            });
          } else {
            conn.end();
          }
        });
    }).on('error', (err) => {
      deny();
    }).connect(sshConfig);
  }).listen(1080, '127.0.0.1', () => {
    console.log('SOCKSv5 proxy server started on port 127.0.0.1:1080');
  }).useAuth(socks.auth.None());
}

// Handler function for SSH tunnel
ipcMain.handle("make-ssh-tunnel", async () => {
  ssh();
});

// Handler function for minimizing the window
ipcMain.handle("minimize", async () => {
  win.minimize();
});

// Handler function for maximizing the window
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

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});