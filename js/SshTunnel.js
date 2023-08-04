const socks = require('socksv5');
const { Client } = require('ssh2');
const config = require('./config');
const { exec } = require('child_process');

class sshTunnel {
    static server;

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
          .listen(1080, "localhost", () => {
            console.log("SOCKSv5 proxy server started on port 1080");
          })
          .useAuth(socks.auth.None());
    }

    static closeconnection() {
        // Stop the SOCKS5 server
        this.server.close(() => {
            console.log('SOCKSv5 proxy server stopped listening on port 1090');
        });
        console.log('SOCKSv5 proxy server stopped listening on port 1090')

        // Close the SSH connection
        this.conn.end(() => {
            console.log('SSH connection closed');
        });
    }



    static Browsing() {
        const command = `"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --user-data-dir="%USERPROFILE%\\proxy-profile" --proxy-server="socks5://localhost:18000"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });
    }
}

module.exports = { sshTunnel };